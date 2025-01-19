"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
async function bootstrap() {
    try {
        app_1.default.listen(5000, () => {
            console.log('🚀 Server started on port 5000');
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
bootstrap();
