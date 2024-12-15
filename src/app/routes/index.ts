import express from 'express'
import { LoginRoutes } from '../modules/auth/auth.route'
import { CategoryRoutes } from '../modules/category/category.route'
import { userRoutes } from '../modules/users/user.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: LoginRoutes,
  },
  {
    path:'/category',
    route:CategoryRoutes
  }

]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
