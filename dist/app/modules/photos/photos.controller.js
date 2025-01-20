"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const photos_service_1 = require("./photos.service");
const createPhoto = (0, catchAsync_1.default)(async (req, res) => {
    const photo = req.body;
    const file = req.file;
    console.log({ file, photo });
    const result = await photos_service_1.PhotoService.createPhoto(photo, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Photo created successfully',
        success: true,
        data: result,
    });
});
const getAllPhotos = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const paginationOptions = req.query;
    const photos = await photos_service_1.PhotoService.getAllPhotos(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Photos retrieved successfully',
        success: true,
        data: photos,
    });
});
const getPhotoById = (0, catchAsync_1.default)(async (req, res) => {
    const photoId = Number(req.params.id);
    const photo = await photos_service_1.PhotoService.getPhotoById(photoId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Photo retrieved successfully',
        success: true,
        data: photo,
    });
});
const updatePhoto = (0, catchAsync_1.default)(async (req, res) => {
    const photoId = Number(req.params.id);
    const photoUpdates = req.body;
    const file = req.file;
    const photo = await photos_service_1.PhotoService.updatePhoto(photoId, photoUpdates, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Photo updated successfully',
        success: true,
        data: photo,
    });
});
const deletePhoto = (0, catchAsync_1.default)(async (req, res) => {
    const photoId = Number(req.params.id);
    const deletedPhoto = await photos_service_1.PhotoService.deletePhoto(photoId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Photo deleted successfully',
        success: true,
        data: deletedPhoto,
    });
});
exports.PhotoController = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto,
};
