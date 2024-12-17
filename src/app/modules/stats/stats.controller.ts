import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatsService } from './stats.service';

const createStats = catchAsync(async (req: Request, res: Response) => {
  const stats = req.body;
  const file = req.file; 
  const result = await StatsService.createStats(stats, file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Stats created successfully',
    success: true,
    data: result,
  });
});

const getAllStats = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const paginationOptions = req.query;
  const stats = await StatsService.getAllStats(filters as any, paginationOptions as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Stats retrieved successfully',
    success: true,
    data: stats,
  });
});

const getStatsById = catchAsync(async (req: Request, res: Response) => {
  const statsId = Number(req.params.id);
  const stats = await StatsService.getStatsById(statsId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Stats retrieved successfully',
    success: true,
    data: stats,
  });
});

const updateStats = catchAsync(async (req: Request, res: Response) => {
  const statsId = Number(req.params.id);
  const statsUpdates = req.body;
  const file = req.file; 
  const updatedStats = await StatsService.updateStats(statsId, statsUpdates, file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Stats updated successfully',
    success: true,
    data: updatedStats,
  });
});

const deleteStats = catchAsync(async (req: Request, res: Response) => {
  const statsId = Number(req.params.id);
  const deletedStats = await StatsService.deleteStats(statsId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Stats deleted successfully',
    success: true,
    data: deletedStats,
  });
});

export const StatsController = {
  createStats,
  getAllStats,
  getStatsById,
  updateStats,
  deleteStats,
};
