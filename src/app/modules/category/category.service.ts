
import httpStatus from "http-status";
import { RowDataPacket } from "mysql2";
import {connection} from "../../../config/db";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { ICategoryFilter } from "./category.constant";
import { ICategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategory = async (category: ICategory, file?: Express.Multer.File): Promise<Partial<ICategory>> => {
    try {
        const nameCheckQuery = `SELECT * FROM categories WHERE name = ?`;
        const [existingCategory] = await connection
            .promise()
            .query(nameCheckQuery, [category.name]);

        if ((existingCategory as RowDataPacket[]).length > 0) {
            throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
        }

        if (file) {
            category.image = `/uploads/${file.filename}`;
        }
        const newCategory = await CategoryModel.createCategory(category);
        return newCategory;
    } catch (error: any) {
        if (error.statusCode === 409) {
            throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
        }
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating category');
    }
};

const getAllCategories = async (
    filters: ICategoryFilter,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
    try {
        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } =
            paginationHelpers.calculatePagination(paginationOptions);

        const whereConditions: string[] = [];
        const queryParams: any[] = [];

        if (searchTerm) {
            const searchConditions = ['name'].map(field => `${field} LIKE ?`).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            queryParams.push(`%${searchTerm}%`);
        }

        if (Object.keys(filtersData).length > 0) {
            Object.entries(filtersData).forEach(([field, value]) => {
                whereConditions.push(`${field} = ?`);
                queryParams.push(value);
            });
        }

        const sortConditions =
            sortBy && ['id', 'name'].includes(sortBy)
                ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
                : '';

        const whereClause =
            whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const query = `SELECT id, name, image FROM categories ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`;
        queryParams.push(limit, skip);

        console.log('Executing Query:', query);
        console.log('Query Parameters:', queryParams);

        const [results] = await connection.promise().query(query, queryParams);
        const categories = results as RowDataPacket[];

        const mappedCategories: ICategory[] = categories.map(row => ({
            id: row.id,
            name: row.name,
            image: row.image,
        }));

        const countQuery = `SELECT COUNT(*) AS total FROM categories ${whereClause}`;
        const countParams = queryParams.slice(0, -2);
        console.log('Count Query:', countQuery);

        const [countResults] = await connection.promise().query(countQuery, countParams);
        const total = (countResults as RowDataPacket[])[0].total;

        return {
            meta: {
                page,
                limit,
                total,
            },
            data: mappedCategories,
        };
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Unable to retrieve categories'
        );
    }
};

const getCategoryById = async (id: number): Promise<Partial<ICategory | null>> => {
    try {
        const category = await CategoryModel.getCategoryById(id);
        if (!category) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
        }
        return category;
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving category'
        );
    }
};

const updateCategory = async (
    id: number,
    categoryUpdates: Partial<ICategory>,
    file?: Express.Multer.File
): Promise<ICategory> => {
    try {
        if (file) {
            categoryUpdates.image = `/uploads/${file.filename}`;
          }
        const category = await CategoryModel.updateCategory(id, categoryUpdates);
        if (!category) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
        }

        const updatedCategory = await CategoryModel.getCategoryById(id);
        if (!updatedCategory) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Error fetching updated category'
            );
        }

        return updatedCategory;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating category');
    }
};

const deleteCategory = async (id: number): Promise<ICategory> => {
    try {
        const category = await CategoryModel.deleteCategory(id);
        if (!category) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
        }
        return category;
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting category');
    }
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};