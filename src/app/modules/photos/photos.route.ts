import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import validateRequest from '../../middlewares/validateRequest'
import { PhotoController } from './photos.controller'
import { PhotoValidation } from './photos.validation'
const router = express.Router()
router.post(
  '/',
  upload.single('image'),
  validateRequest(PhotoValidation.createPhotoZodSchema),
  PhotoController.createPhoto
)
router.get('/', PhotoController.getAllPhotos)
router.get('/:id', PhotoController.getPhotoById)
router.patch(
  '/:id',
  upload.single('image'),
  validateRequest(PhotoValidation.updatePhotoZodSchema),
  PhotoController.updatePhoto
)
router.delete('/:id', PhotoController.deletePhoto)

export const photoRoutes = router
