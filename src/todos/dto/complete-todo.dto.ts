import { IsBoolean } from 'class-validator';

export class CompleteTodoDto {
  @IsBoolean()
  completed: boolean;
}
