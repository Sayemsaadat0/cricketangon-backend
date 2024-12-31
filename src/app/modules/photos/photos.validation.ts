import { z } from 'zod';

const PhotoCategories = ['regular', 'moment'] as const;
const createPhotoZodSchema = z.object({
  body: z.object({
    // image: z.string({
    //   required_error: 'Photo is required',
    // }),
    category: z.enum(PhotoCategories, {
        required_error: 'Category is required',
      }),
  }),
});
const updatePhotoZodSchema = z.object({
    body: z.object({
      image: z.string().optional(),
      category: z.enum(['regular', 'moment']).optional()
    }),
  });

export const PhotoValidation = {
  createPhotoZodSchema,
  updatePhotoZodSchema,
};
