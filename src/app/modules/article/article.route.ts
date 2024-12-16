import express from 'express';
import { upload } from '../../middlewares/uploadImage'; 
import validateRequest from '../../middlewares/validateRequest';  
import { ArticleController } from './article.controller';  
import { articleValidation } from './article.validation'; 

const router = express.Router();


router.post(
  '/',
  upload.single('image'), 
  validateRequest(articleValidation.createArticle),  
  ArticleController.createArticle  
);
router.get(
  '/',
  validateRequest(articleValidation.getAllArticles),
  ArticleController.getAllArticles 
);

router.get(
  '/:id',
  validateRequest(articleValidation.getArticleById),  
  ArticleController.getArticleById  
);

router.patch(
  '/:id',
  upload.single('image'),  
  validateRequest(articleValidation.updateArticle),
  ArticleController.updateArticle  
);

router.delete(
  '/:id',
  validateRequest(articleValidation.deleteArticle),  
  ArticleController.deleteArticle 
);

export const ArticleRoutes = router;  
