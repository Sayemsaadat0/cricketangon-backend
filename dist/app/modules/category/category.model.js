"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const categoryQueries_1 = require("../../../queries/categoryQueries");
const createCategory = (category) => {
    const { name, image } = category;
    return new Promise((resolve, reject) => {
        db_1.connection.query(categoryQueries_1.CategoryQueries.CREATE_CATEGORY, [name, image], err => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating category', err.stack));
            }
            const newCategory = {
                name,
                image,
            };
            resolve(newCategory);
        });
    });
};
const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(categoryQueries_1.CategoryQueries.GET_ALL_CATEGORIES, (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving categories', err.stack));
            }
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No categories found'));
            }
            const categories = rows.map(row => row);
            resolve(categories);
        });
    });
};
const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(categoryQueries_1.CategoryQueries.GET_CATEGORY_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving category', err.stack));
            }
            const rows = results;
            const category = rows.length > 0 ? rows[0] : null;
            if (!category) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found'));
            }
            resolve(category);
        });
    });
};
const updateCategory = (id, categoryUpdates) => {
    const { name, image } = categoryUpdates;
    return new Promise((resolve, reject) => {
        db_1.connection.query(categoryQueries_1.CategoryQueries.UPDATE_CATEGORY, [name, image, id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating category', err.stack));
            }
            const { affectedRows } = results;
            if (affectedRows === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found'));
            }
            resolve({
                id,
                name: name,
                image: image,
            });
        });
    });
};
const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(categoryQueries_1.CategoryQueries.GET_CATEGORY_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving category before deletion', err.stack));
            }
            const rows = results;
            const category = rows.length > 0 ? rows[0] : null;
            if (!category) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found'));
            }
            db_1.connection.query(categoryQueries_1.CategoryQueries.DELETE_CATEGORY, [id], deleteErr => {
                if (deleteErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting category', deleteErr.stack));
                }
                resolve(category);
            });
        });
    });
};
exports.CategoryModel = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
