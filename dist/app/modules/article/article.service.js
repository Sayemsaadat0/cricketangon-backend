"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = __importDefault(require("../../../config/db"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const article_model_1 = require("./article.model");
const createArticle = async (article, file) => {
    try {
        const titleCheckQuery = `SELECT * FROM articles WHERE title = ?`;
        const [existingArticle] = await db_1.default
            .promise()
            .query(titleCheckQuery, [article.title]);
        const userCheckQuery = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db_1.default
            .promise()
            .query(userCheckQuery, [article.userId]);
        if (existingArticle.length > 0) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Article title already exists');
        }
        const existingUser = rows;
        if (existingUser.length > 0 && existingUser[0].role === 'user') {
            article.isApproved = false;
        }
        else {
            article.isApproved = true;
        }
        console.log(existingUser);
        if (file) {
            article.image = `/uploads/${file.filename}`;
        }
        const newArticle = await article_model_1.ArticleModel.createArticle(article);
        return newArticle;
    }
    catch (error) {
        if (error.statusCode === 409) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Article title already exists');
        }
        console.error(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating article');
    }
};
const getAllArticles = async (filters, paginationOptions) => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const whereConditions = [];
        const queryParams = [];
        if (searchTerm) {
            const searchConditions = ['title', 'authorName']
                .map(field => `${field} LIKE ?`)
                .join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(`%${searchTerm}%`);
        }
        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }
        const sortConditions = sortBy && ['id', 'title', 'authorName'].includes(sortBy)
            ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
            : '';
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, title, authorName, image, description, categoryId, userId FROM articles ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);
        console.log('Executing Query:', query);
        console.log('Query Parameters:', queryParams);
        const [results] = await db_1.default.promise().query(query, queryParams);
        const articles = results;
        const mappedArticles = articles.map(row => ({
            id: row.id,
            title: row.title,
            authorName: row.authorName,
            image: row.image,
            description: row.description,
            categoryId: row.categoryId,
            userId: row.userId,
        }));
        const countQuery = `SELECT COUNT(*) AS total FROM articles ${whereClause}`;
        const countParams = queryParams.slice(0, -2);
        console.log('Count Query:', countQuery);
        const [countResults] = await db_1.default
            .promise()
            .query(countQuery, countParams);
        const total = countResults[0].total;
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: mappedArticles,
        };
    }
    catch (error) {
        console.error('Error in getAllArticles:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve articles');
    }
};
const getArticleById = async (id) => {
    try {
        const article = await article_model_1.ArticleModel.getArticleById(id);
        if (!article) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found');
        }
        return article;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving article');
    }
};
const updateArticle = async (id, articleUpdates, file) => {
    try {
        if (file) {
            articleUpdates.image = `/uploads/${file.filename}`;
        }
        const article = await article_model_1.ArticleModel.updateArticle(id, articleUpdates);
        if (!article) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found');
        }
        const updatedArticle = await article_model_1.ArticleModel.getArticleById(id);
        if (!updatedArticle) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching updated article');
        }
        return updatedArticle;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating article');
    }
};
const deleteArticle = async (id) => {
    try {
        const article = await article_model_1.ArticleModel.deleteArticle(id);
        if (!article) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found');
        }
        return article;
    }
    catch (error) {
        console.error(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting article');
    }
};
exports.ArticleService = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
