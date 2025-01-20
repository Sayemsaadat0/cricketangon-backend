import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { CategoryQueries } from '../../../queries/categoryQueries'
import { ICategory } from './category.interface'

const createCategory = (category: ICategory): Promise<Partial<ICategory>> => {
  const { name, image } = category
  return new Promise((resolve, reject) => {
    connection.query(CategoryQueries.CREATE_CATEGORY, [name, image], err => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error creating category',
            err.stack
          )
        )
      }
      const newCategory = {
        name,
        image,
      }
      resolve(newCategory)
    })
  })
}

const getAllCategories = (): Promise<ICategory[]> => {
  return new Promise((resolve, reject) => {
    connection.query(CategoryQueries.GET_ALL_CATEGORIES, (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving categories',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      if (rows.length === 0) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'No categories found'))
      }

      const categories = rows.map(row => row as ICategory)
      resolve(categories)
    })
  })
}

const getCategoryById = (id: number): Promise<ICategory | null> => {
  return new Promise((resolve, reject) => {
    connection.query(
      CategoryQueries.GET_CATEGORY_BY_ID,
      [id],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error retrieving category',
              err.stack
            )
          )
        }

        const rows = results as RowDataPacket[]
        const category = rows.length > 0 ? (rows[0] as ICategory) : null

        if (!category) {
          return reject(
            new ApiError(httpStatus.NOT_FOUND, 'Category not found')
          )
        }

        resolve(category)
      }
    )
  })
}

const updateCategory = (
  id: number,
  categoryUpdates: Partial<ICategory>
): Promise<ICategory> => {
  const { name, image } = categoryUpdates
  return new Promise((resolve, reject) => {
    connection.query(
      CategoryQueries.UPDATE_CATEGORY,
      [name, image, id],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error updating category',
              err.stack
            )
          )
        }

        const { affectedRows } = results as RowDataPacket
        if (affectedRows === 0) {
          return reject(
            new ApiError(httpStatus.NOT_FOUND, 'Category not found')
          )
        }

        resolve({
          id,
          name: name as string,
          image: image as string,
        })
      }
    )
  })
}

const deleteCategory = (id: number): Promise<ICategory> => {
  return new Promise((resolve, reject) => {
    connection.query(
      CategoryQueries.GET_CATEGORY_BY_ID,
      [id],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error retrieving category before deletion',
              err.stack
            )
          )
        }

        const rows = results as RowDataPacket[]
        const category = rows.length > 0 ? (rows[0] as ICategory) : null

        if (!category) {
          return reject(
            new ApiError(httpStatus.NOT_FOUND, 'Category not found')
          )
        }

        connection.query(CategoryQueries.DELETE_CATEGORY, [id], deleteErr => {
          if (deleteErr) {
            return reject(
              new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Error deleting category',
                deleteErr.stack
              )
            )
          }
          resolve(category)
        })
      }
    )
  })
}

export const CategoryModel = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}
