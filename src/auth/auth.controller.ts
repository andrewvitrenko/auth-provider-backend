import { Body, Controller, Post } from '@nestjs/common';

import { UseUserData } from '@/shared/decorators/use-user-data';
import type { SafeUser } from '@/shared/model/db';
import { CreateUserDto } from '@/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { UseLocalGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseLocalGuard()
  @Post('login')
  login(@UseUserData() user: SafeUser) {
    return this.authService.login(user);
  }

  @Post('sign-up')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
