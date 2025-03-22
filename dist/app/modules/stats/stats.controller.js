"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const stats_service_1 = require("./stats.service");
const createStats = (0, catchAsync_1.default)(async (req, res) => {
    const stats = req.body;
    const file = req.file;
    const result = await stats_service_1.StatsService.createStats(stats, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Stats created successfully',
        success: true,
        data: result,
    });
});
const getAllStats = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const paginationOptions = req.query;
    const stats = await stats_service_1.StatsService.getAllStats(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Stats retrieved successfully',
        success: true,
        data: stats,
    });
});
const getStatsById = (0, catchAsync_1.default)(async (req, res) => {
    const statsId = Number(req.params.id);
    const stats = await stats_service_1.StatsService.getStatsById(statsId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Stats retrieved successfully',
        success: true,
        data: stats,
    });
});
const updateStats = (0, catchAsync_1.default)(async (req, res) => {
    const statsId = Number(req.params.id);
    const statsUpdates = req.body;
    const file = req.file;
    const updatedStats = await stats_service_1.StatsService.updateStats(statsId, statsUpdates, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Stats updated successfully',
        success: true,
        data: updatedStats,
    });
});
const deleteStats = (0, catchAsync_1.default)(async (req, res) => {
    const statsId = Number(req.params.id);
    const deletedStats = await stats_service_1.StatsService.deleteStats(statsId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Stats deleted successfully',
        success: true,
        data: deletedStats,
    });
});
exports.StatsController = {
    createStats,
    getAllStats,
    getStatsById,
    updateStats,
    deleteStats,
};
