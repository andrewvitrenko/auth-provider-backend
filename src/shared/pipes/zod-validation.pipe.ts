import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

import { ZodErrorMessage } from '../model/validation';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const zodError: ZodErrorMessage = JSON.parse(
        (error as z.ZodError).message,
      );
      console.log(zodError[0].message);
      const message = zodError[0].message;
      throw new BadRequestException(message);
    }
  }
}
