import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Request } from 'express';

import { SessionsService } from '../sessions.service';

@Injectable()
class SessionGuard implements CanActivate {
  constructor(private readonly sessionsService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request<{ sessionId: string }>>();
    const { sessionId } = request.params;

    if (!isUUID(sessionId)) {
      throw new BadRequestException('Invalid session ID');
    }

    const session = await this.sessionsService.getSessionById(sessionId);

    return session?.userId === request.user?.['id'];
  }
}

export const UseSessionGuard = () => UseGuards(SessionGuard);
