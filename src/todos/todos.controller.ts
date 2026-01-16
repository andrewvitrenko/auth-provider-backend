import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt-auth.guard';
import { UseUserData } from '@/shared/decorators/use-user-data';

import { CompleteTodoDto } from './dto/complete-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UseTodosGuard } from './guards/todos.guard';
import { TodosService } from './todos.service';

@UseJwtGuard()
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('/')
  get(
    @UseUserData('id') userId: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.todosService.getList(userId, search, page, limit);
  }

  @Post('/create')
  create(
    @UseUserData('id') userId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(userId, createTodoDto);
  }

  @UseTodosGuard()
  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(todoId, updateTodoDto);
  }

  @UseTodosGuard()
  @Patch('/:id/complete')
  complete(
    @Param('id', ParseUUIDPipe) todoId: string,
    @Body() completeTodoDto: CompleteTodoDto,
  ) {
    return this.todosService.complete(todoId, completeTodoDto);
  }

  @UseTodosGuard()
  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) todoId: string) {
    return this.todosService.delete(todoId);
  }
}
