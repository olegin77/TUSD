import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(solanaAddress: string, signature: string): Promise<any> {
    // TODO: Implement signature verification for Solana/Tron
    // For now, just return a mock user
    const user = await this.prisma.user.findUnique({
      where: { solana_address: solanaAddress },
    });

    if (!user) {
      // Create user if doesn't exist
      return await this.prisma.user.create({
        data: {
          solana_address: solanaAddress,
        },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      solanaAddress: user.solana_address,
      tronAddress: user.tron_address,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        solanaAddress: user.solana_address,
        tronAddress: user.tron_address,
        email: user.email,
        isKycVerified: user.is_kyc_verified,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
