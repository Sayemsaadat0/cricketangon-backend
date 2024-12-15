import express from 'express';
import { upload } from '../../middlewares/uploadImage';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { categoryValidation } from './category.validation';
const router = express.Router()
router.post(
    '/',
    upload.single('image'), 
    validateRequest(categoryValidation.createCategory),
    CategoryController.createCategory
  );

export const CategoryRoutes = router