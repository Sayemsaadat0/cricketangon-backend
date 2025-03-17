import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import { ArticleController } from './article.controller'
const router = express.Router()

router.post('/', upload.single('image'), ArticleController.createArticle)
router.get('/', ArticleController.getAllArticles)

router.get('/:id', ArticleController.getArticleById)

router.patch('/:id', upload.single('image'), ArticleController.updateArticle)

router.delete('/:id', ArticleController.deleteArticle)

export const ArticleRoutes = router
