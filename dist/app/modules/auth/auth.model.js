"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const userQueries_1 = require("../../../queries/userQueries");
const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.FIND_USER_BY_EMAIL, [email], (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving user', err.stack));
            const rows = results;
            const user = rows.length > 0 ? rows[0] : null;
            if (!user) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
            }
            resolve(user);
        });
    });
};
exports.AuthModel = {
    getUserByEmail,
};
