import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Request } from 'express';

import { TodosService } from '../todos.service';

@Injectable()
class TodosGuard implements CanActivate {
  constructor(private readonly todosService: TodosService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request<{ id: string }>>();
    const todoId = request.params.id;

    if (!isUUID(todoId)) {
      throw new BadRequestException('Invalid todo id');
    }

    const todo = await this.todosService.getById(todoId);

    if (!todo) {
      throw new BadRequestException('Todo not found');
    }

    return todo.userId === request.user?.['id'];
  }
}

export const UseTodosGuard = () => UseGuards(TodosGuard);
