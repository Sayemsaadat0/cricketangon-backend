import express from 'express'
import { userRoutes } from '../modules/users/user.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },

]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
