import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { SessionUser } from '@/auth/interfaces/session.interface';

export const UseUserData = createParamDecorator(
  (data: keyof SessionUser, ctx) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return data ? request.user?.[data] : request.user;
  },
);
