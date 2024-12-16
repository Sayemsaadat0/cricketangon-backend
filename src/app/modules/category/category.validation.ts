import { z } from 'zod';

const createCategory = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
  }),
});

const getCategoryById = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }),
  }),
});

const updateCategory = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }),
  }),
  body: z.object({
    name: z.string().optional(),
  }),
});

const deleteCategory = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }),
  }),
});

export const categoryValidation = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
