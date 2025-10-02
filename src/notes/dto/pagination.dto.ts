import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.preprocess(
    val => (val ? Number.parseInt(val as string, 10) : 1),
    z.number().min(1).default(1),
  ),
  limit: z.preprocess(
    val => (val ? Number.parseInt(val as string, 10) : 10),
    z.number().min(1).max(100).default(10),
  ),
})

export type PaginationDto = z.infer<typeof paginationSchema>
