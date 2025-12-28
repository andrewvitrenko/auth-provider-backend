import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';

import { PrismaService } from '@/prisma/prisma.service';
import { IEnv } from '@/shared/model/env';

import { JwtPayload, SessionTokens } from './interfaces/jwt-payload.interface';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<IEnv, true>,
    private readonly jwtService: JwtService,
  ) {}

  public async create(userId: string, email: string): Promise<SessionTokens> {
    const session = await this.prismaService.userSession.create({
      data: { userId, expiresAt: addDays(new Date(), 7) },
    });

    const tokens = this.generateTokens(session.id, userId, email);

    await this.prismaService.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refresh_token,
      },
    });

    return tokens;
  }

  public async refresh(sessionId: string): Promise<SessionTokens> {
    const session = await this.prismaService.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      throw new BadRequestException('Invalid refresh token');
    }

    const tokens = this.generateTokens(
      session.id,
      session.userId,
      session.user.email,
    );

    await this.prismaService.userSession.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refresh_token },
    });

    return tokens;
  }

  public async getSessionByRefreshToken(refreshToken: string) {
    return this.prismaService.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  public async getSessionById(sessionId: string) {
    return this.prismaService.userSession.findUnique({
      where: { id: sessionId },
    });
  }

  private generateTokens(
    sessionId: string,
    userId: string,
    email: string,
  ): SessionTokens {
    const payload: JwtPayload = { sub: userId, email, sid: sessionId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public async logout(sessionId: string): Promise<void> {
    await this.prismaService.userSession.delete({
      where: { id: sessionId },
    });
  }

  public getSessionsByUserId(userId: string, excludeSessionId?: string) {
    return this.prismaService.userSession.findMany({
      where: {
        userId,
        id: excludeSessionId ? { not: excludeSessionId } : undefined,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
