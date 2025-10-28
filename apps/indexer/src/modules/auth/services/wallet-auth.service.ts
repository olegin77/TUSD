import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import { WalletLoginDto, WalletType } from '../dto/wallet-login.dto';

@Injectable()
export class WalletAuthService {
  private readonly logger = new Logger(WalletAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
   * Verify Tron wallet signature
   * TODO: Implement Tron signature verification
   */
  private verifyTronSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ): boolean {
    // For now, return false - will implement when Tron integration is ready
    this.logger.warn('Tron signature verification not yet implemented');
    return false;
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

    // Check if message is recent (within 5 minutes)
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (timestampMatch) {
      const messageTimestamp = parseInt(timestampMatch[1]);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (now - messageTimestamp > fiveMinutes) {
        throw new UnauthorizedException('Message expired');
      }
    }

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
