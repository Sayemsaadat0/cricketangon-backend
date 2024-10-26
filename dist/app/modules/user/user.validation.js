"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        role: zod_1.z.enum([...user_constant_1.UserRole], {
            required_error: 'role is required',
        }),
        password: zod_1.z.string().optional(),
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            }),
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        budget: zod_1.z.number({
            required_error: 'budget is required',
        }),
        income: zod_1.z.number({
            required_error: 'income is required',
        }),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        role: zod_1.z.enum([...user_constant_1.UserRole], {
            required_error: 'role is required',
        }),
        password: zod_1.z.string().optional(),
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            }),
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        budget: zod_1.z.number({
            required_error: 'budget is required',
        }),
        income: zod_1.z.number({
            required_error: 'income is required',
        }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
};
