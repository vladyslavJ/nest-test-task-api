import { z } from 'zod'

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
})

export type UpdateNoteDto = z.infer<typeof updateNoteSchema>
