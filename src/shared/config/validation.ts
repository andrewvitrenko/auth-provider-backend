import { z } from 'zod';

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int('Page must be a valid integer')
    .positive('Page must be a positive integer')
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .int('Limit must be a valid integer')
    .positive('Limit must be a positive integer')
    .max(100, 'Limit must not exceed 100')
    .optional()
    .default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
