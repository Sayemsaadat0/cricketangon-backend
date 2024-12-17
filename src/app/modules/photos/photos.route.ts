import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PhotoValidation } from './photos.validation';
import { PhotoController } from './photos.controller';
const router = express.Router();
router.post('/', validateRequest(PhotoValidation.createPhotoZodSchema), PhotoController.createPhoto);
router.get('/', PhotoController.getAllPhotos);
router.get('/:id', PhotoController.getPhotoById);
router.patch('/:id', validateRequest(PhotoValidation.updatePhotoZodSchema), PhotoController.updatePhoto);
router.delete('/:id', PhotoController.deletePhoto);

export const photoRoutes = router;
