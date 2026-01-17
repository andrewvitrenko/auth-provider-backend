export interface IZodErrorMessageDetails {
  origin: string;
  code: string;
  path: ['page'];
  message: 'Page must be a positive integer';
}

export type ZodErrorMessage = IZodErrorMessageDetails[];
