"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.LoginValidation.loginZodSchema), auth_controller_1.AuthController.LoginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.LoginValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
exports.default = router;
