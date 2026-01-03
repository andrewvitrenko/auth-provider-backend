import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt-auth.guard';
import { UseUserData } from '@/shared/decorators/use-user-data';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseJwtGuard()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  getMe(@UseUserData('id') id: string) {
    return this.usersService.getById(id);
  }

  @Patch('/profile')
  updateUser(
    @UseUserData('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/me')
  deleteUser(@UseUserData('id') id: string) {
    return this.usersService.delete(id);
  }
}
