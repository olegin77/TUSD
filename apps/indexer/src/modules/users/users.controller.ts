import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class UpdateUserDto {
  email?: string;
  telegram_id?: string;
  is_kyc_verified?: boolean;
  is_active?: boolean;
}

export class LinkWalletDto {
  walletType: 'solana' | 'tron';
  address: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(BigInt(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Request() req) {
    return this.usersService.getStats(BigInt(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(BigInt(req.user.id), updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link-wallet')
  linkWallet(@Request() req, @Body() linkWalletDto: LinkWalletDto) {
    return this.usersService.linkWallet(
      BigInt(req.user.id),
      linkWalletDto.walletType,
      linkWalletDto.address,
    );
  }
}
