"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../../enums/users");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post('/', order_controller_1.OrderController.createOrder);
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.ADMIN), order_controller_1.OrderController.getAllOrder);
exports.default = router;
