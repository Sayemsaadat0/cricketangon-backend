"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategory = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, 'Name must be at least 3 characters long'),
    }),
});
const getCategoryById = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Category ID is required' }),
    }),
});
const updateCategory = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Category ID is required' }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
    }),
});
const deleteCategory = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Category ID is required' }),
    }),
});
exports.categoryValidation = {
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
