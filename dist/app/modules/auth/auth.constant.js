"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        req.user = { user: decoded };
        next();
    }
    catch (err) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
