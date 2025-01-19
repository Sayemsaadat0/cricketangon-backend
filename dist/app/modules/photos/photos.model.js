"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const photosQueries_1 = require("../../../queries/photosQueries");
const createPhoto = (photo) => {
    const { image, category } = photo;
    return new Promise((resolve, reject) => {
        db_1.connection.query(photosQueries_1.PhotoQueries.CREATE_PHOTO, [image, category], err => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating photo'));
            }
            const newPhoto = {
                image,
                category,
            };
            resolve(newPhoto);
        });
    });
};
const getAllPhotos = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(photosQueries_1.PhotoQueries.GET_ALL_PHOTOS, (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving photos', err.stack));
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No photos found'));
            }
            const photos = rows.map(row => row);
            resolve(photos);
        });
    });
};
const getPhotoById = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(photosQueries_1.PhotoQueries.GET_PHOTO_BY_ID, [id], (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving photo', err.stack));
            const rows = results;
            const photo = rows.length > 0 ? rows[0] : null;
            if (!photo) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found'));
            }
            resolve(photo);
        });
    });
};
const updatePhoto = (id, photoUpdates) => {
    const { image, category } = photoUpdates;
    return new Promise((resolve, reject) => {
        db_1.connection.query(photosQueries_1.PhotoQueries.UPDATE_PHOTO, [image, category, id], (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating photo', err.stack));
            const { affectedRows } = results;
            if (affectedRows === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found'));
            }
            resolve(affectedRows);
        });
    });
};
const deletePhoto = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(photosQueries_1.PhotoQueries.GET_PHOTO_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving photo before deletion', err.stack));
            }
            const rows = results;
            const photo = rows.length > 0 ? rows[0] : null;
            if (!photo) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Photo not found'));
            }
            db_1.connection.query(photosQueries_1.PhotoQueries.DELETE_PHOTO, [id], deleteErr => {
                if (deleteErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting photo', deleteErr.stack));
                }
                resolve(photo);
            });
        });
    });
};
exports.PhotoModel = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto,
};
