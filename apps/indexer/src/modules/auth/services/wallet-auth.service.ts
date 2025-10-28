import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { WalletLoginDto, WalletType } from '../dto/wallet-login.dto';
// M-5 fix: Import TronWeb for Tron signature verification
import TronWeb from 'tronweb';

@Injectable()
export class WalletAuthService {
  private readonly logger = new Logger(WalletAuthService.name);

  // H-4 fix: In-memory nonce tracking
  // TODO: Replace with Redis for production (distributed system)
  private usedNonces = new Map<string, number>(); // nonce -> timestamp
  private readonly NONCE_CLEANUP_INTERVAL = 60000; // 1 minute
  private readonly NONCE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    // H-4 fix: Periodic cleanup of expired nonces
    setInterval(() => this.cleanupExpiredNonces(), this.NONCE_CLEANUP_INTERVAL);
  }

  /**
   * H-4 fix: Clean up expired nonces to prevent memory leak
   */
  private cleanupExpiredNonces() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [nonce, timestamp] of this.usedNonces.entries()) {
      if (now - timestamp > this.NONCE_TTL) {
        expiredKeys.push(nonce);
      }
    }

    expiredKeys.forEach((key) => this.usedNonces.delete(key));

    if (expiredKeys.length > 0) {
      this.logger.debug(`Cleaned up ${expiredKeys.length} expired nonces`);
    }
  }

  /**
   * Generate a nonce message for wallet to sign
   */
  generateNonce(walletAddress: string): string {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(7);

    return `USDX/Wexel Authentication

Please sign this message to verify your wallet ownership.

Wallet: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;
  }

  /**
   * Verify Solana wallet signature
   */
  private verifySolanaSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ): boolean {
    try {
      // Decode public key and signature
      const publicKeyBytes = bs58.decode(walletAddress);
      const signatureBytes = bs58.decode(signature);
      const messageBytes = new TextEncoder().encode(message);

      // Verify signature
      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes,
      );

      return verified;
    } catch (error) {
      this.logger.error('Failed to verify Solana signature', error);
      return false;
    }
  }

  /**
   * M-5 fix: Verify Tron wallet signature using TronWeb
   */
  private verifyTronSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ): boolean {
    try {
      // Initialize TronWeb (no need for full nodes for signature verification)
      // @ts-ignore - TronWeb constructor types are not accurate
      const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io', // Mainnet (can be changed to testnet)
      });

      // Convert hex address to base58 format if needed
      let base58Address = walletAddress;
      if (walletAddress.startsWith('0x') || walletAddress.startsWith('41')) {
        try {
          base58Address = tronWeb.address.fromHex(walletAddress);
        } catch (e) {
          // Already in base58 format
          this.logger.debug('Address already in base58 format');
        }
      }

      // Tron uses Ethereum-compatible signatures (v, r, s format)
      // Remove '0x' prefix if present
      const cleanSignature = signature.startsWith('0x')
        ? signature.slice(2)
        : signature;

      // Verify signature
      // TronWeb.Trx.verifyMessage(message, signature) returns the address that signed
      const recoveredAddress = tronWeb.trx.verifyMessageV2(
        message,
        cleanSignature,
      );

      // Compare recovered address with provided wallet address
      const isValid =
        recoveredAddress.toLowerCase() === base58Address.toLowerCase();

      if (!isValid) {
        this.logger.warn(
          `Tron signature mismatch. Expected: ${base58Address}, Got: ${recoveredAddress}`,
        );
      }

      return isValid;
    } catch (error) {
      this.logger.error('Failed to verify Tron signature', error);
      return false;
    }
  }

  /**
   * Authenticate user with wallet signature
   */
  async loginWithWallet(walletLoginDto: WalletLoginDto) {
    const { walletAddress, signature, message, walletType } = walletLoginDto;

    // Verify signature
    let isValid = false;
    if (walletType === WalletType.SOLANA) {
      isValid = this.verifySolanaSignature(walletAddress, message, signature);
    } else if (walletType === WalletType.TRON) {
      isValid = this.verifyTronSignature(walletAddress, message, signature);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // H-4 fix: Extract and validate nonce to prevent replay attacks
    const nonceMatch = message.match(/Nonce: (\w+)/);
    if (!nonceMatch) {
      throw new UnauthorizedException('Invalid message format: nonce missing');
    }

    const nonce = nonceMatch[1];

    // H-4 fix: Check if nonce was already used (replay attack)
    if (this.usedNonces.has(nonce)) {
      this.logger.warn(
        `Replay attack detected: nonce ${nonce} already used for wallet ${walletAddress}`,
      );
      throw new UnauthorizedException(
        'Replay attack detected: nonce already used',
      );
    }

    // Check if message is recent (within 5 minutes)
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (!timestampMatch) {
      throw new UnauthorizedException(
        'Invalid message format: timestamp missing',
      );
    }

    const messageTimestamp = parseInt(timestampMatch[1]);
    const now = Date.now();

    if (now - messageTimestamp > this.NONCE_TTL) {
      throw new UnauthorizedException('Message expired');
    }

    // H-4 fix: Mark nonce as used
    this.usedNonces.set(nonce, now);
    this.logger.debug(
      `Nonce ${nonce} marked as used for wallet ${walletAddress}`,
    );

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where:
        walletType === WalletType.SOLANA
          ? { solana_address: walletAddress }
          : { tron_address: walletAddress },
    });

    if (!user) {
      // Auto-create user on first login
      user = await this.prisma.user.create({
        data:
          walletType === WalletType.SOLANA
            ? { solana_address: walletAddress }
            : { tron_address: walletAddress },
      });

      this.logger.log(`New user created: ${walletAddress}`);
    }

    // Generate JWT
    const payload = {
      sub: user.id.toString(),
      walletAddress: walletAddress,
      walletType: walletType,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      user: {
        id: user.id.toString(),
        solanaAddress: user.solana_address,
        tronAddress: user.tron_address,
        email: user.email,
        isKycVerified: user.is_kyc_verified,
        isActive: user.is_active,
      },
      token,
    };
  }

  /**
   * Get current user from JWT payload
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id.toString(),
      solanaAddress: user.solana_address,
      tronAddress: user.tron_address,
      email: user.email,
      isKycVerified: user.is_kyc_verified,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * Verify user owns a wallet address
   */
  async verifyWalletOwnership(
    userId: string,
    walletAddress: string,
    walletType: WalletType,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return false;
    }

    if (walletType === WalletType.SOLANA) {
      return user.solana_address === walletAddress;
    } else if (walletType === WalletType.TRON) {
      return user.tron_address === walletAddress;
    }

    return false;
  }
}
