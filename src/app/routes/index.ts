import express from 'express'
import { ArticleRoutes } from '../modules/article/article.route'
import { LoginRoutes } from '../modules/auth/auth.route'
import { CategoryRoutes } from '../modules/category/category.route'
import { photoRoutes } from '../modules/photos/photos.route'
import { StatsRoutes } from '../modules/stats/stats.route'
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
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/article',
    route: ArticleRoutes,
  },
  {
    path: '/photos',
    route: photoRoutes,
  },
  {
    path: '/stats',
    route: StatsRoutes,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
