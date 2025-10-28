import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WalletAuthService } from './services/wallet-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { WalletLoginDto, WalletVerifyDto } from './dto/wallet-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly walletAuthService: WalletAuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * POST /api/v1/auth/wallet/nonce
   * Generate nonce message for wallet to sign
   */
  @Post('wallet/nonce')
  async getNonce(@Body() body: { walletAddress: string }) {
    const message = this.walletAuthService.generateNonce(body.walletAddress);
    return {
      success: true,
      message,
    };
  }

  /**
   * POST /api/v1/auth/wallet/login
   * Login with wallet signature (SIWS/SIWT)
   */
  @Post('wallet/login')
  async walletLogin(@Body() walletLoginDto: WalletLoginDto) {
    return this.walletAuthService.loginWithWallet(walletLoginDto);
  }

  /**
   * POST /api/v1/auth/wallet/verify
   * Verify wallet ownership for current user
   */
  @UseGuards(JwtAuthGuard)
  @Post('wallet/verify')
  async verifyWallet(@Request() req: any, @Body() verifyDto: WalletVerifyDto) {
    const userId = req.user.sub;
    const isOwner = await this.walletAuthService.verifyWalletOwnership(
      userId,
      verifyDto.walletAddress,
      verifyDto.walletType,
    );
    return {
      success: true,
      isOwner,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const userId = req.user.sub;
    return this.walletAuthService.getCurrentUser(userId);
  }

  @Post('verify')
  async verify(@Body('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
