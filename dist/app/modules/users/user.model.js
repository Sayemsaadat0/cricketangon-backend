"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const userQueries_1 = require("../../../queries/userQueries");
const createUser = (user) => {
    const { name, email, password, role, image, address } = user;
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.CREATE_USER, [name, email, password, role, image, address], err => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating user'));
            }
            const newUser = {
                name,
                email,
                role,
                image,
                address,
            };
            resolve(newUser);
        });
    });
};
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.GET_ALL_USERS, (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving users', err.stack));
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No users found'));
            }
            const users = rows.map(row => row);
            resolve(users);
        });
    });
};
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.GET_USER_BY_ID, [id], (err, results) => {
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
const updateUser = (id, userUpdates) => {
    const { name, email, password, role, image, address } = userUpdates;
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.UPDATE_USER, [name, email, password, role, image, address, id], (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating user', err.stack));
            const { affectedRows } = results;
            console.log(affectedRows);
            if (affectedRows === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
            }
            resolve(affectedRows);
        });
    });
};
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.GET_USER_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving user before deletion', err.stack));
            }
            const rows = results;
            const user = rows.length > 0 ? rows[0] : null;
            if (!user) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
            }
            db_1.connection.query(userQueries_1.UserQueries.DELETE_USER, [id], deleteErr => {
                if (deleteErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting user', deleteErr.stack));
                }
                resolve(user);
            });
        });
    });
};
exports.UserModel = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
