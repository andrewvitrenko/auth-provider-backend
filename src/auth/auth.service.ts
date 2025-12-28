import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import type { SafeUser } from '@/shared/model/db';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';

import type { SessionTokens } from './interfaces/jwt-payload.interface';
import { SessionsService } from './sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  public login(user: SafeUser): Promise<SessionTokens> {
    return this.sessionsService.create(user.id, user.email);
  }

  async signup(createUserDto: CreateUserDto) {
    const userExists = await this.usersService
      .getDbUser(createUserDto.email)
      .catch(() => null);

    if (userExists) {
      throw new BadRequestException('User with such email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.sessionsService.create(user.id, user.email);
  }
}
