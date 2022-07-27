import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { Token } from './entity/token.entity';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
