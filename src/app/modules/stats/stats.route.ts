import express from 'express'
import { upload } from '../../middlewares/uploadImage'
import { StatsController } from './stats.controller'

const router = express.Router()

router.post('/', upload.single('image'), StatsController.createStats)

router.get('/', StatsController.getAllStats)

router.get('/:id', StatsController.getStatsById)
router.patch('/:id', upload.single('image'), StatsController.updateStats)

router.delete('/:id', StatsController.deleteStats)

export const StatsRoutes = router
