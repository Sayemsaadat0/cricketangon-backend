"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsValidation = void 0;
const zod_1 = require("zod");
const createStatsZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        authorName: zod_1.z
            .string()
            .min(3, 'Author name must be at least 3 characters long'),
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters long'),
        description: zod_1.z
            .string()
            .min(1, 'Description must be at least 10 characters long'),
    }),
});
const getStatsByIdZodValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Stats ID is required' }),
    }),
});
const updateStatsZodValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Stats ID is required' }),
    }),
    body: zod_1.z.object({
        authorName: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        image: zod_1.z.string().url('Image must be a valid URL').optional(),
        description: zod_1.z.string().optional(),
    }),
});
const deleteStatsZodValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Stats ID is required' }),
    }),
});
exports.statsValidation = {
    createStatsZodValidation,
    getStatsByIdZodValidation,
    updateStatsZodValidation,
    deleteStatsZodValidation,
};
