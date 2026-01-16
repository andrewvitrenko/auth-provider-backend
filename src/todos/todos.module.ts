import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [PrismaModule, UsersModule],
  exports: [TodosService],
})
export class TodosModule {}
