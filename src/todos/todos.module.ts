import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [PrismaModule],
  exports: [TodosService],
})
export class TodosModule {}
