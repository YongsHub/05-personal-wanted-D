import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user-credential.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { User as CurrentUser } from './user-decorator';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async signup(@Body() signupDto: UserDto) {
    const { email, password } = signupDto;
    return this.authService.signup(email, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserDto) {
    return user;
  }
}
