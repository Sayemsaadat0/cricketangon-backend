"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoValidation = void 0;
const zod_1 = require("zod");
const PhotoCategories = ['regular', 'moment'];
const createPhotoZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        // image: z.string({
        //   required_error: 'Photo is required',
        // }),
        category: zod_1.z.enum(PhotoCategories, {
            required_error: 'Category is required',
        }),
    }),
});
const updatePhotoZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        category: zod_1.z.enum(['regular', 'moment']).optional()
    }),
});
exports.PhotoValidation = {
    createPhotoZodSchema,
    updatePhotoZodSchema,
};
