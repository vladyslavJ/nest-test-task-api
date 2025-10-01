import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  isBlocked: z.boolean().optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
