"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const stats_model_1 = require("./stats.model");
const createStats = async (stats, file) => {
    try {
        if (file) {
            stats.image = `/uploads/${file.filename}`;
        }
        const newStats = await stats_model_1.StatsModel.createStat(stats);
        return newStats;
    }
    catch (error) {
        console.error('Error creating stats:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating stats');
    }
};
const getAllStats = async (filters, paginationOptions) => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const whereConditions = [];
        const queryParams = [];
        if (searchTerm) {
            const searchConditions = ['title', 'description', 'authorName', "description"]
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
        const sortConditions = sortBy && ['id', 'title'].includes(sortBy)
            ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
            : '';
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, title,image, created_at, updated_at, authorName, description FROM stats ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);
        const [results] = await db_1.connection.promise().query(query, queryParams);
        const stats = results;
        const mappedStats = stats.map(row => ({
            id: row.id,
            authorName: row.authorName,
            title: row.title,
            image: row.image,
            description: row.description,
            created_at: row.created_at,
            updated_at: row.updated_at
        }));
        const countQuery = `SELECT COUNT(*) AS total FROM stats ${whereClause}`;
        const countParams = queryParams.slice(0, -2);
        const [countResults] = await db_1.connection
            .promise()
            .query(countQuery, countParams);
        const total = countResults[0].total;
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: mappedStats,
        };
    }
    catch (error) {
        console.error('Error in getAllStats:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve stats');
    }
};
const getStatsById = async (id) => {
    try {
        const stats = await stats_model_1.StatsModel.getStatById(id);
        if (!stats) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stats not found');
        }
        return stats;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving stats');
    }
};
const updateStats = async (id, statsUpdates, file) => {
    try {
        if (file) {
            statsUpdates.image = `/uploads/${file.filename}`;
        }
        const stats = await stats_model_1.StatsModel.updateStat(id, statsUpdates);
        if (!stats) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stats not found');
        }
        const updatedStats = await stats_model_1.StatsModel.getStatById(id);
        if (!updatedStats) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching updated stats');
        }
        return updatedStats;
    }
    catch (error) {
        console.error('Error updating stats:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating stats');
    }
};
const deleteStats = async (id) => {
    try {
        const stats = await stats_model_1.StatsModel.deleteStat(id);
        if (!stats) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stats not found');
        }
        return stats;
    }
    catch (error) {
        console.error('Error deleting stats:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting stats');
    }
};
exports.StatsService = {
    createStats,
    getAllStats,
    getStatsById,
    updateStats,
    deleteStats,
};
