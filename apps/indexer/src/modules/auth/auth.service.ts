import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        solana_address: registerDto.solana_address,
        tron_address: registerDto.tron_address,
        email: registerDto.email,
        password: registerDto.password,
        telegram_id: registerDto.telegram_id,
        is_kyc_verified: registerDto.is_kyc_verified || false,
      },
    });

    const payload = {
      sub: user.id,
      solanaAddress: user.solana_address,
      tronAddress: user.tron_address,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        solanaAddress: user.solana_address,
        tronAddress: user.tron_address,
        email: user.email,
        isKycVerified: user.is_kyc_verified,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { solana_address: loginDto.solana_address },
          { tron_address: loginDto.tron_address },
          { email: loginDto.email },
        ],
      },
    });

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      solanaAddress: user.solana_address,
      tronAddress: user.tron_address,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        solanaAddress: user.solana_address,
        tronAddress: user.tron_address,
        email: user.email,
        isKycVerified: user.is_kyc_verified,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        solanaAddress: user.solana_address,
        tronAddress: user.tron_address,
        email: user.email,
        isKycVerified: user.is_kyc_verified,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
