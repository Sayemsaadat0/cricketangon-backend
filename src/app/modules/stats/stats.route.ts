import express from 'express';
import { upload } from '../../middlewares/uploadImage';
import validateRequest from '../../middlewares/validateRequest';
import { StatsController } from './stats.controller';
import { statsValidation } from './stats.validation';

const router = express.Router();


router.post(
  '/',
  upload.single('image'),
  validateRequest(statsValidation.createStatsZodValidation), 
  StatsController.createStats
);

router.get('/', StatsController.getAllStats);

router.get(
  '/:id',
  validateRequest(statsValidation.getStatsByIdZodValidation),  
  StatsController.getStatsById
);
router.patch(
  '/:id',
  upload.single('image'),
  validateRequest(statsValidation.updateStatsZodValidation),  
  StatsController.updateStats
);

router.delete(
  '/:id',
  validateRequest(statsValidation.deleteStatsZodValidation),  
  StatsController.deleteStats
);

export const StatsRoutes = router;
