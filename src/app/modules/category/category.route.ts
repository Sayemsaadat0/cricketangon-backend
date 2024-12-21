import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import validateRequest from '../../middlewares/validateRequest'
import { CategoryController } from './category.controller'
import { categoryValidation } from './category.validation'
const router = express.Router()
router.post(
  '/',
  upload.single('image'),
  validateRequest(categoryValidation.createCategory),
  CategoryController.createCategory
)
router.get('/', CategoryController.getAllCategories)

router.get(
  '/:id',

  validateRequest(categoryValidation.getCategoryById),
  CategoryController.getCategoryById
)

router.patch(
  '/:id',
  upload.single('image'),
  validateRequest(categoryValidation.updateCategory),
  CategoryController.updateCategory
)

router.delete(
  '/:id',
  validateRequest(categoryValidation.deleteCategory),
  CategoryController.deleteCategory
)

export const CategoryRoutes = router
