"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const article_controller_1 = require("./article.controller");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), article_controller_1.ArticleController.createArticle);
router.get('/', article_controller_1.ArticleController.getAllArticles);
router.get('/:id', article_controller_1.ArticleController.getArticleById);
router.patch('/:id', uploadImage_1.upload.single('image'), article_controller_1.ArticleController.updateArticle);
router.delete('/:id', article_controller_1.ArticleController.deleteArticle);
exports.ArticleRoutes = router;
