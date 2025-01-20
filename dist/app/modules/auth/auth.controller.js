"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { ...loginData } = req.body;
    const result = await auth_service_1.AuthService.loginUser(loginData);
    const { refreshToken, ...others } = result;
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    if ('refreshToken' in result) {
        delete result.refreshToken;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged in successfully',
        data: others,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Refresh token is required');
    }
    const result = await auth_service_1.AuthService.refreshAccessToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Token refreshed successfully',
        data: result,
    });
});
const sendVerificationCode = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const result = await auth_service_1.AuthService.sendVerificationCode(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
});
const matchVerificationCode = (0, catchAsync_1.default)(async (req, res) => {
    const { email, code } = req.body;
    const result = await auth_service_1.AuthService.matchVerificationCode(email, code);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email, newPassword } = req.body;
    const result = await auth_service_1.AuthService.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const userId = user?.user?.id;
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized');
    }
    const result = await auth_service_1.AuthService.changePassword(userId, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
});
exports.AuthController = {
    loginUser,
    refreshToken,
    sendVerificationCode,
    matchVerificationCode,
    resetPassword,
    changePassword
};
