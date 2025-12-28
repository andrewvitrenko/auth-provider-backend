import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IEnv } from '@/shared/model/env';
import { UsersService } from '@/users/users.service';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionUser } from '../interfaces/session.interface';
import { SessionsService } from '../sessions.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    configService: ConfigService<IEnv, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<SessionUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const session = await this.sessionsService.getSessionByRefreshToken(token);

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.usersService.getById(payload.sub);

    if (!user) throw new UnauthorizedException();

    return { ...user, sessionId: payload.sid };
  }
}
