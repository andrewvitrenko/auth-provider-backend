import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== request.user?.['id']) {
      throw new ForbiddenException();
    }

    return true;
  }
}

export const UseTodosGuard = () => UseGuards(TodosGuard);
