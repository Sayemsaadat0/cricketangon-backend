"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const photos_constant_1 = require("./photos.constant");
const photos_model_1 = require("./photos.model");
const createPhoto = async (photo, file) => {
    try {
        if (file) {
            photo.image = `/uploads/${file.filename}`;
        }
        const newPhoto = await photos_model_1.PhotoModel.createPhoto(photo);
        return newPhoto;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating photo');
    }
};
const getAllPhotos = async (filters, paginationOptions) => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const whereConditions = [];
        const queryParams = [];
        if (searchTerm) {
            const searchConditions = photos_constant_1.PhotoSearchableFields.map(field => `${field} LIKE ?`).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(`%${searchTerm}%`);
        }
        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }
        const sortConditions = sortBy && ['id', 'category', 'created_at'].includes(sortBy)
            ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
            : '';
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, image, category FROM photos ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);
        console.log('Executing Query:', query);
        console.log('Query Parameters:', queryParams);
        const [results] = await db_1.connection.promise().query(query, queryParams);
        const photos = results;
        const mappedPhotos = photos.map(row => ({
            id: row.id,
            image: row.image,
            category: row.category,
        }));
        const countQuery = `SELECT COUNT(*) AS total FROM photos ${whereClause}`;
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
            data: mappedPhotos,
        };
    }
    catch (error) {
        console.error('Error in getAllPhotos:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve photos');
    }
};
const getPhotoById = async (id) => {
    try {
        const photo = await photos_model_1.PhotoModel.getPhotoById(id);
        if (!photo) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found');
        }
        return photo;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving photo');
    }
};
const updatePhoto = async (id, photoUpdates, file) => {
    try {
        if (file) {
            photoUpdates.image = `/uploads/${file.filename}`;
        }
        const photo = await photos_model_1.PhotoModel.updatePhoto(id, photoUpdates);
        if (!photo) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found');
        }
        const updatedPhoto = await photos_model_1.PhotoModel.getPhotoById(id);
        if (!updatedPhoto) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching updated photo');
        }
        return updatedPhoto;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating photo');
    }
};
const deletePhoto = async (id) => {
    try {
        const photo = await photos_model_1.PhotoModel.deletePhoto(id);
        if (!photo) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found');
        }
        return photo;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting photo');
    }
};
exports.PhotoService = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto,
};
