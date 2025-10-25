import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'solanaAddress',
      passwordField: 'signature',
    });
  }

  async validate(solanaAddress: string, signature: string): Promise<any> {
    const user = await this.authService.validateUser(solanaAddress, signature);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
