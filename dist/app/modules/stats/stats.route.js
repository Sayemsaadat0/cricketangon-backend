"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const stats_controller_1 = require("./stats.controller");
const stats_validation_1 = require("./stats.validation");
const router = express_1.default.Router();
router.post('/', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(stats_validation_1.statsValidation.createStatsZodValidation), stats_controller_1.StatsController.createStats);
router.get('/', stats_controller_1.StatsController.getAllStats);
router.get('/:id', (0, validateRequest_1.default)(stats_validation_1.statsValidation.getStatsByIdZodValidation), stats_controller_1.StatsController.getStatsById);
router.patch('/:id', uploadImage_1.upload.single('image'), (0, validateRequest_1.default)(stats_validation_1.statsValidation.updateStatsZodValidation), stats_controller_1.StatsController.updateStats);
router.delete('/:id', (0, validateRequest_1.default)(stats_validation_1.statsValidation.deleteStatsZodValidation), stats_controller_1.StatsController.deleteStats);
exports.StatsRoutes = router;
