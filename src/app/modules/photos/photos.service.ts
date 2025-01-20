/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IPhotoFilter, PhotoSearchableFields } from './photos.constant'
import { IPhotos } from './photos.interface'
import { PhotoModel } from './photos.model'

const createPhoto = async (
  photo: IPhotos,
  file?: Express.Multer.File
): Promise<Partial<IPhotos>> => {
  try {
    if (file) {
      photo.image = `/uploads/${file.filename}`
    }
    const newPhoto = await PhotoModel.createPhoto(photo)
    return newPhoto
  } catch (error: any) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating photo')
  }
}

const getAllPhotos = async (
  filters: IPhotoFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPhotos[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)

    const whereConditions: string[] = []
    const queryParams: any[] = []

    if (searchTerm) {
      const searchConditions = PhotoSearchableFields.map(
        field => `${field} LIKE ?`
      ).join(' OR ')
      whereConditions.push(`(${searchConditions})`)
      queryParams.push(`%${searchTerm}%`)
    }

    if (Object.keys(filtersData).length > 0) {
      Object.entries(filtersData).forEach(([field, value]) => {
        whereConditions.push(`${field} = ?`)
        queryParams.push(value)
      })
    }

    const sortConditions =
      sortBy && ['id', 'category', 'created_at'].includes(sortBy)
        ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
        : ''

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    const query = `SELECT id, image, category FROM photos ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`
    queryParams.push(limit, skip)

    console.log('Executing Query:', query)
    console.log('Query Parameters:', queryParams)

    const [results] = await connection.promise().query(query, queryParams)
    const photos = results as RowDataPacket[]

    const mappedPhotos: IPhotos[] = photos.map(row => ({
      id: row.id,
      image: row.image,
      category: row.category,
    }))

    const countQuery = `SELECT COUNT(*) AS total FROM photos ${whereClause}`
    const countParams = queryParams.slice(0, -2)

    const [countResults] = await connection
      .promise()
      .query(countQuery, countParams)
    const total = (countResults as RowDataPacket[])[0].total

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: mappedPhotos,
    }
  } catch (error) {
    console.error('Error in getAllPhotos:', error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve photos'
    )
  }
}

const getPhotoById = async (id: number): Promise<IPhotos | null> => {
  try {
    const photo = await PhotoModel.getPhotoById(id)
    if (!photo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Photo not found')
    }
    return photo
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error retrieving photo'
    )
  }
}

const updatePhoto = async (
  id: number,
  photoUpdates: Partial<IPhotos>,
  file?: Express.Multer.File
): Promise<IPhotos> => {
  try {
    if (file) {
      photoUpdates.image = `/uploads/${file.filename}`
    }
    const photo = await PhotoModel.updatePhoto(id, photoUpdates)
    if (!photo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Photo not found')
    }
    const updatedPhoto = await PhotoModel.getPhotoById(id)
    if (!updatedPhoto) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching updated photo'
      )
    }
    return updatedPhoto
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating photo')
  }
}

const deletePhoto = async (id: number): Promise<IPhotos> => {
  try {
    const photo = await PhotoModel.deletePhoto(id)
    if (!photo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Photo not found')
    }
    return photo
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting photo')
  }
}

export const PhotoService = {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
}
