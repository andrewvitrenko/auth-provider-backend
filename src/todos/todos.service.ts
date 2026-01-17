import { BadRequestException, Injectable } from '@nestjs/common';

import { Todo } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { IPaginatedResponse } from '@/shared/model/utils';

import { CompleteTodoDto } from './dto/complete-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getList(
    userId: string,
    search: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<Todo>> {
    const dbQuery = {
      where: {
        userId,
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      },
      orderBy: { createdAt: 'desc' as const },
      skip: (page - 1) * limit,
      take: limit,
    };

    const todos = await this.prismaService.todo.findMany(dbQuery);
    const total = await this.prismaService.todo.count({ where: dbQuery.where });

    return { data: todos, total };
  }

  public getById(id: string): Promise<Todo | null> {
    return this.prismaService.todo.findUnique({ where: { id } });
  }

  public create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.prismaService.todo.create({
      data: { ...createTodoDto, userId },
    });
  }

  public update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (Object.keys(updateTodoDto).length === 0) {
      throw new BadRequestException('Cannot process with empty payload');
    }

    return this.prismaService.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  public complete(id: string, completeTodoDto: CompleteTodoDto): Promise<Todo> {
    return this.prismaService.todo.update({
      where: { id },
      data: {
        completed: completeTodoDto.completed,
        completedAt: completeTodoDto.completed ? new Date() : null,
      },
    });
  }

  public delete(id: string): Promise<Todo> {
    return this.prismaService.todo.delete({ where: { id } });
  }
}
