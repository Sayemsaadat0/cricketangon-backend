"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const article_controller_1 = require("./article.controller");
const article_validation_1 = require("./article.validation");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(article_validation_1.articleValidation.createArticle), article_controller_1.ArticleController.createArticle);
router.get('/', (0, validateRequest_1.default)(article_validation_1.articleValidation.getAllArticles), article_controller_1.ArticleController.getAllArticles);
router.get('/:id', (0, validateRequest_1.default)(article_validation_1.articleValidation.getArticleById), article_controller_1.ArticleController.getArticleById);
router.patch('/:id', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(article_validation_1.articleValidation.updateArticle), article_controller_1.ArticleController.updateArticle);
router.delete('/:id', (0, validateRequest_1.default)(article_validation_1.articleValidation.deleteArticle), article_controller_1.ArticleController.deleteArticle);
exports.ArticleRoutes = router;
