"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const article_service_1 = require("./article.service");
const createArticle = (0, catchAsync_1.default)(async (req, res) => {
    const article = req.body;
    const file = req.file;
    const result = await article_service_1.ArticleService.createArticle(article, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Article created successfully',
        success: true,
        data: result,
    });
});
const getAllArticles = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const paginationOptions = req.query;
    const articles = await article_service_1.ArticleService.getAllArticles(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Articles retrieved successfully',
        success: true,
        data: articles,
    });
});
const getArticleById = (0, catchAsync_1.default)(async (req, res) => {
    const articleId = Number(req.params.id);
    const article = await article_service_1.ArticleService.getArticleById(articleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Article retrieved successfully',
        success: true,
        data: article,
    });
});
const updateArticle = (0, catchAsync_1.default)(async (req, res) => {
    const articleId = Number(req.params.id);
    const articleUpdates = req.body;
    const file = req.file;
    const updatedArticle = await article_service_1.ArticleService.updateArticle(articleId, articleUpdates, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Article updated successfully',
        success: true,
        data: updatedArticle,
    });
});
const deleteArticle = (0, catchAsync_1.default)(async (req, res) => {
    const articleId = Number(req.params.id);
    const deletedArticle = await article_service_1.ArticleService.deleteArticle(articleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Article deleted successfully',
        success: true,
        data: deletedArticle,
    });
});
exports.ArticleController = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
