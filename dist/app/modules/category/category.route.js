"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), category_controller_1.CategoryController.createCategory);
router.get('/', category_controller_1.CategoryController.getAllCategories);
router.get('/:id', category_controller_1.CategoryController.getCategoryById);
router.patch('/:id', uploadImage_1.upload.single('image'), category_controller_1.CategoryController.updateCategory);
router.delete('/:id', category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
