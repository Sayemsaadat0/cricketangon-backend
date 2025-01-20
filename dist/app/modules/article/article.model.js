"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const articleQueries_1 = require("../../../queries/articleQueries");
const createArticle = (article) => {
    console.log('log article', article);
    const { authorName, title, categoryId, image, isApproved, description, userId, } = article;
    return new Promise((resolve, reject) => {
        db_1.connection.query(articleQueries_1.ArticleQueries.CREATE_ARTICLE, [authorName, title, categoryId, image, description, userId, isApproved], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating article', err.stack));
            }
            console.log(results);
            const newArticle = {
                authorName,
                title,
                categoryId,
                image,
                description,
                userId,
            };
            resolve(newArticle);
        });
    });
};
const getAllArticles = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(articleQueries_1.ArticleQueries.GET_ALL_ARTICLES, (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving articles', err.stack));
            }
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No articles found'));
            }
            const articles = rows.map(row => {
                return {
                    id: row.id,
                    authorName: row.authorName,
                    title: row.title,
                    categoryId: row.categoryId,
                    image: row.image,
                    description: row.description,
                    userId: row.userId,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    userEmail: row.userEmail,
                    userRole: row.userRole,
                };
            });
            resolve(articles);
        });
    });
};
const getArticleById = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(articleQueries_1.ArticleQueries.GET_ARTICLE_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving article', err.stack));
            }
            const rows = results;
            const article = rows.length > 0 ? rows[0] : null;
            if (!article) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found'));
            }
            resolve(article);
        });
    });
};
const updateArticle = (id, articleUpdates) => {
    const { authorName, title, categoryId, image, description, userId } = articleUpdates;
    return new Promise((resolve, reject) => {
        db_1.connection.query(articleQueries_1.ArticleQueries.UPDATE_ARTICLE, [authorName, title, categoryId, image, description, userId, id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating article', err.stack));
            }
            const { affectedRows } = results;
            if (affectedRows === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found'));
            }
            resolve({
                authorName: authorName,
                title: title,
                categoryId: categoryId,
                image: image,
                description: description,
                userId: userId,
            });
        });
    });
};
const deleteArticle = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(articleQueries_1.ArticleQueries.GET_ARTICLE_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving article before deletion', err.stack));
            }
            const rows = results;
            const article = rows.length > 0 ? rows[0] : null;
            if (!article) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Article not found'));
            }
            db_1.connection.query(articleQueries_1.ArticleQueries.DELETE_ARTICLE, [id], deleteErr => {
                if (deleteErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting article', deleteErr.stack));
                }
                resolve(article);
            });
        });
    });
};
exports.ArticleModel = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
