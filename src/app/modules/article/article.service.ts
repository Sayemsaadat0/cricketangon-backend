import { RowDataPacket } from "mysql2";
import connection from "../../../config/db";
import { IArticle } from "./article.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ArticleModel } from "./article.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IArticleFilter } from "./article.constant";

const createArticle = async (article: IArticle, file?: Express.Multer.File): Promise<Partial<IArticle>> => {
    try {
        const titleCheckQuery = `SELECT * FROM articles WHERE title = ?`;
        const [existingArticle] = await connection
            .promise()
            .query(titleCheckQuery, [article.title]);

        if ((existingArticle as RowDataPacket[]).length > 0) {
            throw new ApiError(httpStatus.CONFLICT, 'Article title already exists');
        }

        if (file) {
            article.image = `/uploads/${file.filename}`;
        }
        const newArticle = await ArticleModel.createArticle(article);
        return newArticle;
    } catch (error: any) {
        if (error.statusCode === 409) {
            throw new ApiError(httpStatus.CONFLICT, 'Article title already exists');
        }
        console.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating article');
    }
};

const getAllArticles = async (
    filters: IArticleFilter,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IArticle[]>> => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } =
            paginationHelpers.calculatePagination(paginationOptions);

        const whereConditions: string[] = [];
        const queryParams: any[] = [];

        if (searchTerm) {
            const searchConditions = ['title', 'authorName'].map(field => `${field} LIKE ?`).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(`%${searchTerm}%`);
        }

        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }

        const sortConditions =
            sortBy && ['id', 'title', 'authorName'].includes(sortBy)
                ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
                : '';

        const whereClause =
            whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, title, authorName, image, description, categoryId, userId FROM articles ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);

        console.log('Executing Query:', query);
        console.log('Query Parameters:', queryParams);

        const [results] = await connection.promise().query(query, queryParams);
        const articles = results as RowDataPacket[];

        const mappedArticles: IArticle[] = articles.map(row => ({
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

        const [countResults] = await connection.promise().query(countQuery, countParams);
        const total = (countResults as RowDataPacket[])[0].total;

        return {
            meta: {
                page,
                limit,
                total,
            },
            data: mappedArticles,
        };
    } catch (error) {
        console.error('Error in getAllArticles:', error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Unable to retrieve articles'
        );
    }
};

const getArticleById = async (id: number): Promise<Partial<IArticle | null>> => {
    try {
        const article = await ArticleModel.getArticleById(id);
        if (!article) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }
        return article;
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving article'
        );
    }
};

const updateArticle = async (
    id: number,
    articleUpdates: Partial<IArticle>,
    file?: Express.Multer.File
): Promise<IArticle> => {
    try {
        if (file) {
            articleUpdates.image = `/uploads/${file.filename}`;
        }
        const article = await ArticleModel.updateArticle(id, articleUpdates);
        if (!article) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }

        const updatedArticle = await ArticleModel.getArticleById(id);
        if (!updatedArticle) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Error fetching updated article'
            );
        }

        return updatedArticle;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating article');
    }
};

const deleteArticle = async (id: number): Promise<IArticle> => {
    try {
        const article = await ArticleModel.deleteArticle(id);
        if (!article) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }
        return article;
    } catch (error) {
        console.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting article');
    }
};

export const ArticleService = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
