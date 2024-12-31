import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PhotoService } from './photos.service'

const createPhoto = catchAsync(async (req: Request, res: Response) => {
  const photo = req.body
  const file = req.file
  console.log({file, photo});
  const result = await PhotoService.createPhoto(photo, file)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Photo created successfully',
    success: true,
    data: result,
  })
})

const getAllPhotos = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query
  const paginationOptions = req.query
  const photos = await PhotoService.getAllPhotos(
    filters as any,
    paginationOptions as any
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Photos retrieved successfully',
    success: true,
    data: photos,
  })
})

const getPhotoById = catchAsync(async (req: Request, res: Response) => {
  const photoId = Number(req.params.id)
  const photo = await PhotoService.getPhotoById(photoId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Photo retrieved successfully',
    success: true,
    data: photo,
  })
})

const updatePhoto = catchAsync(async (req: Request, res: Response) => {
  const photoId = Number(req.params.id)
  const photoUpdates = req.body
  const file = req.file
  const photo = await PhotoService.updatePhoto(photoId, photoUpdates, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Photo updated successfully',
    success: true,
    data: photo,
  })
})

const deletePhoto = catchAsync(async (req: Request, res: Response) => {
  const photoId = Number(req.params.id)
  const deletedPhoto = await PhotoService.deletePhoto(photoId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Photo deleted successfully',
    success: true,
    data: deletedPhoto,
  })
})

export const PhotoController = {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
}
