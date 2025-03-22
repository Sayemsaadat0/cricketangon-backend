"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const stats_controller_1 = require("./stats.controller");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), stats_controller_1.StatsController.createStats);
router.get('/', stats_controller_1.StatsController.getAllStats);
router.get('/:id', stats_controller_1.StatsController.getStatsById);
router.patch('/:id', uploadImage_1.upload.single('image'), stats_controller_1.StatsController.updateStats);
router.delete('/:id', stats_controller_1.StatsController.deleteStats);
exports.StatsRoutes = router;
