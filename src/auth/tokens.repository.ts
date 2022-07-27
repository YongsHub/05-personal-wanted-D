import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}
}
