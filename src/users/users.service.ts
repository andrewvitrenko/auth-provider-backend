import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { SafeUser } from '@/shared/model/db';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(createUserDto: CreateUserDto): Promise<SafeUser> {
    return this.prismaService.user.create({
      data: createUserDto,
      omit: { password: true },
    });
  }

  public getDbUser(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public getById(id: string): Promise<SafeUser | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  public update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Cannot update user with empty data');
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true },
    });
  }

  public delete(id: string): Promise<SafeUser> {
    return this.prismaService.user.delete({
      where: { id },
      omit: { password: true },
    });
  }
}
