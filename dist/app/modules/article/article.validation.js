"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleValidation = void 0;
const zod_1 = require("zod");
const createArticle = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        authorName: zod_1.z.string().min(1, 'Author Name is required'),
    }),
});
const getArticleById = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Article ID is required' }),
    }),
});
const updateArticle = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Article ID is required' }),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').optional(),
        description: zod_1.z.string().min(1, 'Description is required').optional(),
        categoryId: zod_1.z.number().int().min(1, 'Category ID is required').optional(),
        authorName: zod_1.z.string().min(1, 'Author Name is required').optional(),
        userId: zod_1.z.number().int().min(1, 'User ID is required').optional(),
    }),
});
const deleteArticle = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Article ID is required' }),
    }),
});
const getAllArticles = zod_1.z.object({
    query: zod_1.z.object({
        searchTerm: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.string().optional(),
    }),
});
exports.articleValidation = {
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    getAllArticles,
};
