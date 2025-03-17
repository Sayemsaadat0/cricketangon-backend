import express from 'express'
import { authenticate } from './auth.constant'
import { AuthController } from './auth.controller'
const router = express.Router()

router.post('/login', AuthController.loginUser)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/verify-email', AuthController.sendVerificationCode)
router.post('/verify-code', AuthController.matchVerificationCode)

router.post('/reset-password', AuthController.resetPassword)

router.post('/change-password', authenticate, AuthController.changePassword)

export const LoginRoutes = router
