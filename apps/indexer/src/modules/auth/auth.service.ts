import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AuthService {
  // In-memory admin users for demo (should be in database in production)
  private readonly adminUsers = [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123', // In production, use bcrypt hash
      role: 'ADMIN',
      email: 'admin@wexel.io',
    },
  ];

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
        // password: registerDto.password, // TODO: Implement password in User schema
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
        id: user.id.toString(), // Convert bigint to string for UserProfile
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

    if (!user) { // TODO: Implement password verification
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
        id: user.id.toString(), // Convert bigint to string for UserProfile
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
        id: user.id.toString(), // Convert bigint to string for UserProfile
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

  /**
   * Admin login with username and password
   */
  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { username, password } = adminLoginDto;

    // Find admin user
    const adminUser = this.adminUsers.find((u) => u.username === username);
    if (!adminUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    // For demo purposes, accept plain text password
    // In production, use bcrypt.compare(password, adminUser.password)
    if (password !== adminUser.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT with admin role
    const payload = {
      sub: adminUser.id,
      username: adminUser.username,
      role: adminUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        email: adminUser.email,
      },
    };
  }

  /**
   * Get admin profile by user ID
   */
  async getAdminProfile(userId: string) {
    const adminUser = this.adminUsers.find((u) => u.id === userId);
    if (!adminUser) {
      throw new UnauthorizedException('Admin user not found');
    }

    return {
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role,
      email: adminUser.email,
    };
  }
}
