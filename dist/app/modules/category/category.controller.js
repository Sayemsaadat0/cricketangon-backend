"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const category_service_1 = require("./category.service");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const category = req.body;
    const file = req.file;
    // console.log(file, 'line 10')
    const result = await category_service_1.CategoryService.createCategory(category, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Category created successfully',
        success: true,
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const paginationOptions = req.query;
    const categories = await category_service_1.CategoryService.getAllCategories(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Categories retrieved successfully',
        success: true,
        data: categories,
    });
});
const getCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await category_service_1.CategoryService.getCategoryById(categoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Category retrieved successfully',
        success: true,
        data: category,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const categoryId = Number(req.params.id);
    const categoryUpdates = req.body;
    const file = req.file;
    const category = await category_service_1.CategoryService.updateCategory(categoryId, categoryUpdates, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Category updated successfully',
        success: true,
        data: category,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const categoryId = Number(req.params.id);
    const deletedCategory = await category_service_1.CategoryService.deleteCategory(categoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Category deleted successfully',
        success: true,
        data: deletedCategory,
    });
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
