"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_route_1 = require("../modules/article/article.route");
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const photos_route_1 = require("../modules/photos/photos.route");
const stats_route_1 = require("../modules/stats/stats.route");
const user_route_1 = require("../modules/users/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.LoginRoutes,
    },
    {
        path: '/category',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/article',
        route: article_route_1.ArticleRoutes,
    },
    {
        path: '/photos',
        route: photos_route_1.photoRoutes,
    },
    {
        path: '/stats',
        route: stats_route_1.StatsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
