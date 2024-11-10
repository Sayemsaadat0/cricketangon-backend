/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { RowDataPacket } from 'mysql2';
import connection from '../../../config/db';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IUserFilter, UserSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import { UserModel } from './user.model';

const createUser = async (user: IUser): Promise<IUser> => {
  try {
    const newUser = await UserModel.createUser(user); 
    return newUser;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating user');
  }
};

const getAllUsers = async (
  filters: IUserFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);
    const whereConditions: string[] = [];
    const queryParams:any[] = [];

    if (searchTerm) {
      const searchConditions = UserSearchableFields.map((field) => `${field} LIKE ?`).join(' OR ');
      whereConditions.push(`(${searchConditions})`);
      queryParams.push(...UserSearchableFields.map(() => `%${searchTerm}%`));
    }

    if (Object.keys(filtersData).length > 0) {
      Object.entries(filtersData).forEach(([field, value]) => {
        whereConditions.push(`${field} = ?`);
        queryParams.push(value);
      });
    }

    const sortConditions = sortBy ? `ORDER BY ${sortBy} ${sortOrder}` : '';
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const query = `SELECT * FROM users ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
    queryParams.push(limit, skip);

    const [results] = await connection.promise().query(query, queryParams);
    const users = results as RowDataPacket[];


    const mappedUsers: IUser[] = users.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      image: row.image,
      address: row.address,
    }));

    const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
    const [countResults] = await connection.promise().query(countQuery, queryParams);
    const total = (countResults as RowDataPacket[])[0].total;

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: mappedUsers,
    };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve users');
  }
};


const getUserById = async (id: number): Promise<IUser | null> => {
  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving user');
  }
};

const updateUser = async (id: number, userUpdates: Partial<IUser>): Promise<void> => {
  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    await UserModel.updateUser(id, userUpdates);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating user');
  }
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    await UserModel.deleteUser(id);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting user');
  }
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
