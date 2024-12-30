import { z } from 'zod'

const createStatsZodValidation = z.object({
  body: z.object({
    authorName: z
      .string()
      .min(3, 'Author name must be at least 3 characters long'),
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z
      .string()
      .min(1, 'Description must be at least 10 characters long'),
  }),
})

const getStatsByIdZodValidation = z.object({
  params: z.object({
    id: z.string({ required_error: 'Stats ID is required' }),
  }),
})

const updateStatsZodValidation = z.object({
  params: z.object({
    id: z.string({ required_error: 'Stats ID is required' }),
  }),
  body: z.object({
    authorName: z.string().optional(),
    title: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    description: z.string().optional(),
  }),
})

const deleteStatsZodValidation = z.object({
  params: z.object({
    id: z.string({ required_error: 'Stats ID is required' }),
  }),
})

export const statsValidation = {
  createStatsZodValidation,
  getStatsByIdZodValidation,
  updateStatsZodValidation,
  deleteStatsZodValidation,
}
