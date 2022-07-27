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
    console.log('이메일', email, password);
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
    const access_token = this.jwtService.sign(payload);

    // if (!user.token) {
    //   user.token = new Token(access_token);
    // } else {
    //   const token = await this.tokenRepository.findOne({
    //     where: { token: user.token.token },
    //   });
    //   token.token = access_token;
    //   await this.tokenRepository.save(token);
    // }
    // // 유저의 토큰 Database에 저장
    // await this.usersRepository.save(user);
    return {
      access_token: access_token,
    };
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
