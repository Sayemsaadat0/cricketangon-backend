import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { PhotoQueries } from '../../../queries/photosQueries'
import { IPhotos } from './photos.interface'

const createPhoto = (photo: IPhotos): Promise<Partial<IPhotos>> => {
  const { image, category } = photo
  return new Promise((resolve, reject) => {
    connection.query(PhotoQueries.CREATE_PHOTO, [image, category], err => {
      if (err) {
        return reject(
          new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating photo')
        )
      }
      const newPhoto = {
        image,
        category,
      }
      resolve(newPhoto)
    })
  })
}

const getAllPhotos = (): Promise<IPhotos[]> => {
  return new Promise((resolve, reject) => {
    connection.query(PhotoQueries.GET_ALL_PHOTOS, (err, results) => {
      if (err)
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving photos',
            err.stack
          )
        )

      const rows = results as RowDataPacket[]
      if (rows.length === 0) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'No photos found'))
      }

      const photos = rows.map(row => row as IPhotos)
      resolve(photos)
    })
  })
}

const getPhotoById = (id: number): Promise<IPhotos | null> => {
  return new Promise((resolve, reject) => {
    connection.query(PhotoQueries.GET_PHOTO_BY_ID, [id], (err, results) => {
      if (err)
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving photo',
            err.stack
          )
        )

      const rows = results as RowDataPacket[]
      const photo = rows.length > 0 ? (rows[0] as IPhotos) : null

      if (!photo) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Photo not found'))
      }

      resolve(photo)
    })
  })
}

const updatePhoto = (
  id: number,
  photoUpdates: Partial<IPhotos>
): Promise<IPhotos> => {
  const { image, category } = photoUpdates
  return new Promise((resolve, reject) => {
    connection.query(
      PhotoQueries.UPDATE_PHOTO,
      [image, category, id],
      (err, results) => {
        if (err)
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error updating photo',
              err.stack
            )
          )
        const { affectedRows } = results as RowDataPacket
        if (affectedRows === 0) {
          return reject(new ApiError(httpStatus.NOT_FOUND, 'Photo not found'))
        }
        resolve(affectedRows)
      }
    )
  })
}

const deletePhoto = (id: number): Promise<IPhotos> => {
  return new Promise((resolve, reject) => {
    connection.query(PhotoQueries.GET_PHOTO_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving photo before deletion',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      const photo = rows.length > 0 ? (rows[0] as IPhotos) : null

      if (!photo) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Photo not found'))
      }

      connection.query(PhotoQueries.DELETE_PHOTO, [id], deleteErr => {
        if (deleteErr) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error deleting photo',
              deleteErr.stack
            )
          )
        }
        resolve(photo)
      })
    })
  })
}

export const PhotoModel = {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
}
