import { z } from 'zod';

import { paginationSchema } from '@/shared/config/validation';

export const todosGetListSchema = paginationSchema.extend({
  search: z.string('Search must be a valid string').optional().default(''),
});

export type TodosGetListParams = z.infer<typeof todosGetListSchema>;
