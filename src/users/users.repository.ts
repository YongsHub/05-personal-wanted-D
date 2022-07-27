import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}
}
