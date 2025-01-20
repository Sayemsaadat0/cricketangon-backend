"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategory), category_controller_1.CategoryController.createCategory);
router.get('/', category_controller_1.CategoryController.getAllCategories);
router.get('/:id', (0, validateRequest_1.default)(category_validation_1.categoryValidation.getCategoryById), category_controller_1.CategoryController.getCategoryById);
router.patch('/:id', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(category_validation_1.categoryValidation.updateCategory), category_controller_1.CategoryController.updateCategory);
router.delete('/:id', (0, validateRequest_1.default)(category_validation_1.categoryValidation.deleteCategory), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
