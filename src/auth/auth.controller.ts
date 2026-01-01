import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { UseUserData } from '@/shared/decorators/use-user-data';
import type { SafeUser } from '@/shared/model/db';
import { CreateUserDto } from '@/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { UseJwtGuard } from './guards/jwt-auth.guard';
import { UseRefreshGuard } from './guards/jwt-refresh.guard';
import { UseLocalGuard } from './guards/local-auth.guard';
import { UseSessionGuard } from './guards/session.guard';
import { SessionsService } from './sessions.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
  ) {}

  @UseLocalGuard()
  @Post('login')
  login(@UseUserData() user: SafeUser) {
    return this.authService.login(user);
  }

  @Post('sign-up')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseRefreshGuard()
  @Post('refresh')
  refresh(@UseUserData('sessionId') sessionId: string) {
    return this.sessionsService.refresh(sessionId);
  }

  @UseRefreshGuard()
  @Post('logout')
  logout(@UseUserData('sessionId') sessionId: string) {
    return this.sessionsService.logout(sessionId);
  }

  @UseJwtGuard()
  @UseSessionGuard()
  @Post('sessions/:sessionId/revoke')
  revokeSession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.sessionsService.logout(sessionId);
  }

  @UseJwtGuard()
  @Get('sessions')
  getSessions(
    @UseUserData('id') userId: string,
    @UseUserData('sessionId') currentSessionId: string,
  ) {
    return this.sessionsService.getSessionsByUserId(userId, currentSessionId);
  }
}
