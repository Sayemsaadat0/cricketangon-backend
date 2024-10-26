"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    if (!admin.password) {
        admin.password = config_1.default.default_user_password;
    }
    if (admin.role !== 'admin') {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'role admin is required');
    }
    const createAdmin = yield user_model_1.User.create(admin);
    if (!createAdmin) {
        throw new ApiError_1.default(400, 'Failed to create Admin');
    }
    return createAdmin;
});
exports.AdminService = {
    createAdmin,
};
