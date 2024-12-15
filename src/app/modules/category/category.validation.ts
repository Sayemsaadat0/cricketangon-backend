import { z } from 'zod';

const createCategory = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
  }),
});

const getCategoryById = z.object({
  params: z.object({
    id: z.number({ required_error: 'Category ID is required' }).int(),
  }),
});

const updateCategory = z.object({
  params: z.object({
    id: z.number({ required_error: 'Category ID is required' }).int(),
  }),
  body: z.object({
    name: z.string().optional(),
  }),
});

const deleteCategory = z.object({
  params: z.object({
    id: z.number({ required_error: 'Category ID is required' }).int(),
  }),
});

export const categoryValidation = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
