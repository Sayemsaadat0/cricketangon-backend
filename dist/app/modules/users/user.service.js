"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const createUser = async (user, file) => {
    try {
        if (file) {
            user.image = `/uploads/${file.filename}`;
        }
        const emailCheckQuery = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await db_1.connection
            .promise()
            .query(emailCheckQuery, [user.email]);
        if (existingUser.length > 0) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Email already exists');
        }
        else {
            const hashedPassword = await bcrypt_1.default.hash(user.password, 12);
            user.password = hashedPassword;
            const newUser = await user_model_1.UserModel.createUser(user);
            return newUser;
        }
    }
    catch (error) {
        if (error.statusCode === 409) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Email already exists');
        }
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating user');
    }
};
const getAllUsers = async (filters, paginationOptions) => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const whereConditions = [];
        const queryParams = [];
        if (searchTerm) {
            const searchConditions = user_constant_1.UserSearchableFields.map(field => `${field} LIKE ?`).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(...user_constant_1.UserSearchableFields.map(() => `%${searchTerm}%`));
        }
        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }
        const sortConditions = sortBy && ['id', 'name', 'email', 'role'].includes(sortBy)
            ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
            : '';
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, name, email, role, image, address FROM users ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);
        const [results] = await db_1.connection.promise().query(query, queryParams);
        const users = results;
        const mappedUsers = users.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role: row.role,
            image: row.image,
            address: row.address,
        }));
        const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
        const countParams = queryParams.slice(0, -2);
        console.log('Count Query:', countQuery);
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
            data: mappedUsers,
        };
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve users');
    }
};
const getUserById = async (id) => {
    try {
        const user = await user_model_1.UserModel.getUserById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        const { password, ...userWithoutPassword } = user;
        console.log(password);
        return userWithoutPassword;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving user');
    }
};
const updateUser = async (id, userUpdates, file) => {
    try {
        if (file) {
            userUpdates.image = `/uploads/${file.filename}`;
        }
        const fields = Object.keys(userUpdates)
            .filter(key => userUpdates[key] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(userUpdates).filter(value => value !== undefined);
        values.push(id);
        if (fields.length === 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No updates provided');
        }
        const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        const [updateResult] = await db_1.connection.promise().query(query, values);
        const { affectedRows } = updateResult;
        if (affectedRows === 0) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        const [rows] = await db_1.connection.promise().query(`SELECT id, name, email, role, image, address, updated_at 
      FROM users 
      WHERE id = ?`, [id]);
        if (rows.length === 0) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching updated user');
        }
        const updatedUser = rows[0];
        const { password, ...responseUser } = updatedUser;
        console.log(password);
        return responseUser;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating user', error instanceof Error ? error.stack : '');
    }
};
const deleteUser = async (id) => {
    try {
        const user = await user_model_1.UserModel.deleteUser(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        console.log(error, ' line 231');
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting user');
    }
};
exports.UserService = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
