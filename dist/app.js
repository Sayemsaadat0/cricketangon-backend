"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:5173/",
        "http://localhost:5174",
        "http://localhost:5174/",
        "http://localhost:3000",
        "http://localhost:3000/",
        "https://cricketangon.com",
        "https://cricketangon.com/",
        "https://cricketangon.com",
        "https://cricketangon.com/",
        "http://cricketangon.com",
        "http://cricketangon.com/",
        "https://cricketangon-client.vercel.app",
        "https://cricketangon-client.vercel.app/",
        "http://cricketangon-client.vercel.app",
        "http://cricketangon-client.vercel.app/",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/api/v1/', routes_1.default);
app.use(globalErrorHandler_1.default);
//Testing
app.get('/', (req, res) => {
    res.send('Working Successfully');
});
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
exports.default = app;
