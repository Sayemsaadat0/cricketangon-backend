import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import { CategoryController } from './category.controller'
const router = express.Router()
router.post('/', upload.single('image'), CategoryController.createCategory)
router.get('/', CategoryController.getAllCategories)

router.get('/:id', CategoryController.getCategoryById)

router.patch('/:id', upload.single('image'), CategoryController.updateCategory)

router.delete('/:id', CategoryController.deleteCategory)

export const CategoryRoutes = router
