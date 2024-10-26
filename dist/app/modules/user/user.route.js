"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../../enums/users");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser);
router.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUser);
router.get('/', user_controller_1.UserController.getAllUsers);
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getSingleUser);
router.delete('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUser);
exports.default = router;
//everything is okay
