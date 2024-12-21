import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { CategoryService } from './category.service'

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = req.body
  const file = req.file
  // console.log(file, 'line 10')
  const result = await CategoryService.createCategory(category, file)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    success: true,
    data: result,
  })
})

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query
  const paginationOptions = req.query
  const categories = await CategoryService.getAllCategories(
    filters as any,
    paginationOptions as any
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    success: true,
    data: categories,
  })
})

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id)
  const category = await CategoryService.getCategoryById(categoryId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category retrieved successfully',
    success: true,
    data: category,
  })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id)
  const categoryUpdates = req.body
  const file = req.file
  const category = await CategoryService.updateCategory(
    categoryId,
    categoryUpdates,
    file
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    success: true,
    data: category,
  })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id)
  const deletedCategory = await CategoryService.deleteCategory(categoryId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    success: true,
    data: deletedCategory,
  })
})

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}
