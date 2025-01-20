import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const file=req.file;
  const result = await UserService.createUser(user,file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    success: true,
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const paginationOptions = req.query;
  const users = await UserService.getAllUsers(filters as any, paginationOptions as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    success: true,
    data: users,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await UserService.getUserById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    success: true,
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const userUpdates = req.body;
  const file=req.file;
  const user = await UserService.updateUser(userId, userUpdates,file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    success: true,
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const deletedUser = await UserService.deleteUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK, 
    message: 'User deleted successfully',
    success: true,
    data: deletedUser,
  });
});


export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
