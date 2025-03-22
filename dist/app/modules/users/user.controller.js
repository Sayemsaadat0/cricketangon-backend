"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.body;
    const file = req.file;
    const result = await user_service_1.UserService.createUser(user, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'User created successfully',
        success: true,
        data: result,
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const paginationOptions = req.query;
    const users = await user_service_1.UserService.getAllUsers(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Users retrieved successfully',
        success: true,
        data: users,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const userId = Number(req.params.id);
    const user = await user_service_1.UserService.getUserById(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        success: true,
        data: user,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = Number(req.params.id);
    const userUpdates = req.body;
    const file = req.file;
    const user = await user_service_1.UserService.updateUser(userId, userUpdates, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User updated successfully',
        success: true,
        data: user,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = Number(req.params.id);
    const deletedUser = await user_service_1.UserService.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        success: true,
        data: deletedUser,
    });
});
exports.UserController = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
