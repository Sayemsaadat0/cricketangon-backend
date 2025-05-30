"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_constant_1 = require("./auth.constant");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/verify-email', auth_controller_1.AuthController.sendVerificationCode);
router.post('/verify-code', auth_controller_1.AuthController.matchVerificationCode);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
router.post('/change-password', auth_constant_1.authenticate, auth_controller_1.AuthController.changePassword);
exports.LoginRoutes = router;
