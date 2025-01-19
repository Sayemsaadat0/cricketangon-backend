import { z } from 'zod'

const createArticle = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),

    authorName: z.string().min(1, 'Author Name is required'),
  }),
})

const getArticleById = z.object({
  params: z.object({
    id: z.string({ required_error: 'Article ID is required' }),
  }),
})

const updateArticle = z.object({
  params: z.object({
    id: z.string({ required_error: 'Article ID is required' }),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    categoryId: z.number().int().min(1, 'Category ID is required').optional(),
    authorName: z.string().min(1, 'Author Name is required').optional(),
    userId: z.number().int().min(1, 'User ID is required').optional(),
  }),
})

const deleteArticle = z.object({
  params: z.object({
    id: z.string({ required_error: 'Article ID is required' }),
  }),
})

const getAllArticles = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
  }),
})

export const articleValidation = {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getAllArticles,
}
