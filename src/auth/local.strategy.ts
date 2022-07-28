import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      //default: username, password 이기 때문에 usernameField -> email로 변경해야함.
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }
    return user;
  }
}
