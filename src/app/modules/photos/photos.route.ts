import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import { PhotoController } from './photos.controller'
const router = express.Router()
router.post('/', upload.single('image'), PhotoController.createPhoto)
router.get('/', PhotoController.getAllPhotos)
router.get('/:id', PhotoController.getPhotoById)
router.patch('/:id', upload.single('image'), PhotoController.updatePhoto)
router.delete('/:id', PhotoController.deletePhoto)

export const photoRoutes = router
