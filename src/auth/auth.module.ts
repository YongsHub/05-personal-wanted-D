import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { Token } from './entity/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
