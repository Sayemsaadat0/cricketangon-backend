"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = require("zod");
const cow_constant_1 = require("./cow.constant");
const createCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        age: zod_1.z.number({
            required_error: 'age is required',
        }),
        location: zod_1.z.enum([...cow_constant_1.CowLocation], {
            required_error: 'Location is required',
        }),
        breed: zod_1.z.enum([...cow_constant_1.CowBreed], {
            required_error: 'Breed is required',
        }),
        weight: zod_1.z.number({
            required_error: 'weight is required',
        }),
        label: zod_1.z.enum([...cow_constant_1.Cowlabel], {
            required_error: 'label is required',
        }),
        category: zod_1.z.enum([...cow_constant_1.CowCategory], {
            required_error: 'Category is required',
        }),
        seller: zod_1.z.string({
            required_error: 'Seller Id is required',
        }),
    }),
});
const updateCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        age: zod_1.z.number({
            required_error: 'age is required',
        }),
        location: zod_1.z.enum([...cow_constant_1.CowLocation], {
            required_error: 'Location is required',
        }),
        breed: zod_1.z.enum([...cow_constant_1.CowBreed], {
            required_error: 'Breed is required',
        }),
        weight: zod_1.z.number({
            required_error: 'weight is required',
        }),
        label: zod_1.z.enum([...cow_constant_1.Cowlabel], {
            required_error: 'label is required',
        }),
        category: zod_1.z.enum([...cow_constant_1.CowCategory], {
            required_error: 'Category is required',
        }),
        seller: zod_1.z
            .string({
            required_error: 'Seller Id is required',
        })
            .optional(),
    }),
});
exports.CowValidation = {
    createCowZodSchema,
    updateCowZodSchema,
};
