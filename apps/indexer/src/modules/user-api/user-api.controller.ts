import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LinkWalletDto } from '../users/dto/link-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';

/**
 * API endpoints for user profile and wallet management
 * According to TZ section 8
 */
@Controller('api/v1/user')
export class UserApiController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/user/profile
   * Get current user profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: CurrentUserData) {
    try {
      const profile = await this.usersService.findOne(user.userId);
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/user/wallets
   * Get linked wallets for current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('wallets')
  async getWallets(@CurrentUser() user: CurrentUserData) {
    try {
      const profile = await this.usersService.findOne(user.userId);
      return {
        success: true,
        data: {
          solana: profile.solana_address,
          tron: profile.tron_address,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get wallets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/user/wallets/link
   * Link a new wallet to user account with signature proof
   */
  @UseGuards(JwtAuthGuard)
  @Post('wallets/link')
  async linkWallet(
    @CurrentUser() user: CurrentUserData,
    @Body() linkWalletDto: LinkWalletDto,
  ) {
    try {
      // TODO: Verify signature to prove wallet ownership
      // For Solana: use @solana/web3.js to verify signature
      // For Tron: use TronWeb to verify signature

      const profile = await this.usersService.findOne(user.userId);

      const updateData: any = {};
      if (linkWalletDto.walletType === 'solana') {
        // Verify that signature matches address
        // const isValid = verifySignature(linkWalletDto.message, linkWalletDto.signature, linkWalletDto.address);
        // if (!isValid) throw new Error('Invalid signature');
        updateData.solana_address = linkWalletDto.address;
      } else if (linkWalletDto.walletType === 'tron') {
        // Similar verification for Tron
        updateData.tron_address = linkWalletDto.address;
      }

      await this.usersService.update(user.userId, updateData);

      return {
        success: true,
        message: 'Wallet linked successfully',
        data: {
          walletType: linkWalletDto.walletType,
          address: linkWalletDto.address,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to link wallet',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
