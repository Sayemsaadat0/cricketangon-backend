"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const category_model_1 = require("./category.model");
const createCategory = async (category, file) => {
    try {
        const nameCheckQuery = `SELECT * FROM categories WHERE name = ?`;
        const [existingCategory] = await db_1.connection
            .promise()
            .query(nameCheckQuery, [category.name]);
        if (existingCategory.length > 0) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Category name already exists');
        }
        if (file) {
            category.image = `/uploads/${file.filename}`;
        }
        const newCategory = await category_model_1.CategoryModel.createCategory(category);
        return newCategory;
    }
    catch (error) {
        if (error.statusCode === 409) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Category name already exists');
        }
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating category');
    }
};
const getAllCategories = async (filters, paginationOptions) => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const whereConditions = [];
        const queryParams = [];
        if (searchTerm) {
            const searchConditions = ['name'].map(field => `${field} LIKE ?`).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(`%${searchTerm}%`);
        }
        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }
        const sortConditions = sortBy && ['id', 'name'].includes(sortBy)
            ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
            : '';
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, name, image FROM categories ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);
        console.log('Executing Query:', query);
        console.log('Query Parameters:', queryParams);
        const [results] = await db_1.connection.promise().query(query, queryParams);
        const categories = results;
        const mappedCategories = categories.map(row => ({
            id: row.id,
            name: row.name,
            image: row.image,
        }));
        const countQuery = `SELECT COUNT(*) AS total FROM categories ${whereClause}`;
        const countParams = queryParams.slice(0, -2);
        console.log('Count Query:', countQuery);
        const [countResults] = await db_1.connection.promise().query(countQuery, countParams);
        const total = countResults[0].total;
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: mappedCategories,
        };
    }
    catch (error) {
        console.error('Error in getAllCategories:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve categories');
    }
};
const getCategoryById = async (id) => {
    try {
        const category = await category_model_1.CategoryModel.getCategoryById(id);
        if (!category) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
        return category;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving category');
    }
};
const updateCategory = async (id, categoryUpdates, file) => {
    try {
        if (file) {
            categoryUpdates.image = `/uploads/${file.filename}`;
        }
        const category = await category_model_1.CategoryModel.updateCategory(id, categoryUpdates);
        if (!category) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
        const updatedCategory = await category_model_1.CategoryModel.getCategoryById(id);
        if (!updatedCategory) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching updated category');
        }
        return updatedCategory;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating category');
    }
};
const deleteCategory = async (id) => {
    try {
        const category = await category_model_1.CategoryModel.deleteCategory(id);
        if (!category) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
        return category;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting category');
    }
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
