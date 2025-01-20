"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
const db_1 = require("../../../config/db");
const userQueries_1 = require("../../../queries/userQueries");
const auth_constant_1 = require("./auth.constant");
const auth_model_1 = require("./auth.model");
const loginUser = async (payload) => {
    const { email, password } = payload;
    try {
        const user = await auth_model_1.AuthModel.getUserByEmail(email);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password did not match');
        }
        const accessToken = jwtHelper_1.jwtHelpers.createToken({
            email: user.email,
            role: user.role,
            id: user.id,
            image: user.image,
            address: user.address
        }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
        const refreshToken = jwtHelper_1.jwtHelpers.createToken({
            email: user.email,
            role: user.role,
            id: user.id,
            image: user.image,
            address: user.address
        }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Login failed');
    }
};
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
        }
        const { email, role, id } = decoded;
        const newAccessToken = jwtHelper_1.jwtHelpers.createToken({ email, role, id }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
        return {
            accessToken: newAccessToken,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Failed to refresh token');
    }
};
const sendVerificationCode = async (email) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(userQueries_1.UserQueries.FIND_USER_BY_EMAIL, [email], async (err, results) => {
            if (err)
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving user', err.stack));
            const rows = results;
            const user = rows.length > 0 ? rows[0] : null;
            if (!user) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            db_1.connection.query(`INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`, [email, verificationCode], async (insertErr) => {
                if (insertErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to save reset request'));
                }
                await (0, auth_constant_1.sendEmail)(email, 'Your Password Reset Code', `Your verification code is: ${verificationCode}`);
                resolve({ message: 'Verification code sent successfully' });
            });
        });
    });
};
const matchVerificationCode = async (email, code) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(`SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()`, [email, code], async (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error verifying code', err.stack));
            }
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired code'));
            }
            resolve({ message: 'Verification code matched successfully' });
        });
    });
};
const resetPassword = async (email, newPassword) => {
    const user = await auth_model_1.AuthModel.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt_1.default.hashSync(newPassword, 12);
        db_1.connection.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email], async (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error resetting password', err.stack));
            }
            console.log(results);
            db_1.connection.query(`DELETE FROM password_resets WHERE email = ?`, [email], err => {
                if (err) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error clearing reset codes', err.stack));
                }
                resolve({ message: 'Password reset successfully' });
            });
        });
    });
};
const changePassword = async (userId, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(`SELECT password FROM users WHERE id = ?`, [userId], async (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving user password', err.stack));
            }
            const rows = results;
            if (rows.length === 0) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
            }
            const currentHashedPassword = rows[0].password;
            const isMatch = bcrypt_1.default.compare(oldPassword, currentHashedPassword);
            if (!isMatch) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
            }
            const hashedNewPassword = bcrypt_1.default.hashSync(newPassword, 12);
            db_1.connection.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedNewPassword, userId], (updateErr, updateResults) => {
                if (updateErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating password', updateErr.stack));
                }
                console.log(updateResults);
                resolve({ message: 'Password changed successfully' });
            });
        });
    });
};
exports.AuthService = {
    loginUser,
    refreshAccessToken,
    sendVerificationCode,
    matchVerificationCode,
    resetPassword,
    changePassword
};
