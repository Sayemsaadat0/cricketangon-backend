"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModel = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = require("../../../config/db");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const statsQueries_1 = require("../../../queries/statsQueries");
const createStat = (stat) => {
    const { authorName, title, image, description } = stat;
    return new Promise((resolve, reject) => {
        db_1.connection.query(statsQueries_1.StatsQueries.CREATE_STAT, [authorName, title, image, description], (err) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error creating stat', err.stack));
            }
            const newStat = { authorName, title, image, description };
            resolve(newStat);
        });
    });
};
const getAllStats = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(statsQueries_1.StatsQueries.GET_ALL_STATS, (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving stats', err.stack));
            }
            const rows = results;
            if (rows.length === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No stats found'));
            }
            const stats = rows.map((row) => row);
            resolve(stats);
        });
    });
};
const getStatById = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(statsQueries_1.StatsQueries.GET_STAT_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving stat', err.stack));
            }
            const rows = results;
            const stat = rows.length > 0 ? rows[0] : null;
            if (!stat) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stat not found'));
            }
            resolve(stat);
        });
    });
};
const updateStat = (id, statUpdates) => {
    const { authorName, title, image, description } = statUpdates;
    return new Promise((resolve, reject) => {
        db_1.connection.query(statsQueries_1.StatsQueries.UPDATE_STAT, [authorName, title, image, description, id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error updating stat', err.stack));
            }
            const { affectedRows } = results;
            if (affectedRows === 0) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stat not found'));
            }
            resolve(affectedRows);
        });
    });
};
const deleteStat = (id) => {
    return new Promise((resolve, reject) => {
        db_1.connection.query(statsQueries_1.StatsQueries.GET_STAT_BY_ID, [id], (err, results) => {
            if (err) {
                return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error retrieving stat before deletion', err.stack));
            }
            const rows = results;
            const stat = rows.length > 0 ? rows[0] : null;
            if (!stat) {
                return reject(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stat not found'));
            }
            db_1.connection.query(statsQueries_1.StatsQueries.DELETE_STAT, [id], (deleteErr) => {
                if (deleteErr) {
                    return reject(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error deleting stat', deleteErr.stack));
                }
                resolve(stat);
            });
        });
    });
};
exports.StatsModel = {
    createStat,
    getAllStats,
    getStatById,
    updateStat,
    deleteStat,
};
