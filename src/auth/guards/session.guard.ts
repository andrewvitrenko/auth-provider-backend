import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { differenceInSeconds } from 'date-fns';
import { Request } from 'express';

import { SessionsService } from '../sessions.service';

@Injectable()
class SessionGuard implements CanActivate {
  constructor(private readonly sessionsService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request<{ sessionId?: string }>>();
    const { sessionId } = request.params;

    if (!sessionId) {
      throw new BadRequestException('User session is required');
    }

    if (!isUUID(sessionId)) {
      throw new BadRequestException('Invalid session ID');
    }

    const session = await this.sessionsService.getSessionById(sessionId);

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    if (differenceInSeconds(session.expiresAt, new Date()) <= 0) {
      throw new BadRequestException('Session has expired');
    }

    return session.userId === request.user?.['id'];
  }
}

export const UseSessionGuard = () => UseGuards(SessionGuard);
