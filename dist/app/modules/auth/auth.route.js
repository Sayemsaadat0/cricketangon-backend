"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_constant_1 = require("./auth.constant");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.LoginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/verify-email', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.ForgotPasswordSchema), auth_controller_1.AuthController.sendVerificationCode);
router.post('/verify-code', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.VerifyCodeSchema), auth_controller_1.AuthController.matchVerificationCode);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.ResetPasswordSchema), auth_controller_1.AuthController.resetPassword);
router.post('/change-password', auth_constant_1.authenticate, (0, validateRequest_1.default)(auth_validation_1.AuthValidation.ChangePasswordSchema), auth_controller_1.AuthController.changePassword);
exports.LoginRoutes = router;
