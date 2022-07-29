import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Token } from './entity/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,

    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { useremail: user.email, sub: user.id };
    const result = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    let token = await result.token;
    const access_token = this.jwtService.sign(payload);
    if (!token) {
      token = new Token(access_token);
      await this.tokenRepository.save(token);
      result.token = Promise.resolve(token);
    } else {
      token.token = access_token;
      await this.tokenRepository.save(token);
    }
    // 유저의 토큰 Database에 저장
    await this.usersRepository.save(result);
    return token;
  }

  async signup(email: string, password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = this.usersRepository.create({
      email: email,
      password: hash,
    });

    if (!user) {
      throw new BadRequestException('잘못된 요청으로 회원가입이 불가합니다.');
    }
    await this.usersRepository.save(user);
  }
}
