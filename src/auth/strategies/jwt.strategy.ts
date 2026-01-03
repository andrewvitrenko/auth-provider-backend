import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IEnv } from '@/shared/model/env';
import { UsersService } from '@/users/users.service';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionUser } from '../interfaces/session.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService<IEnv, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<SessionUser> {
    const user = await this.usersService.getById(payload.sub);

    if (!user) throw new UnauthorizedException();

    return { ...user, sessionId: payload.sid };
  }
}
