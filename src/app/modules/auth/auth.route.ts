import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { authenticate } from './auth.constant'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.LoginZodSchema),
  AuthController.loginUser
)
router.post('/refresh-token', AuthController.refreshToken)
router.post(
  '/verify-email',
  validateRequest(AuthValidation.ForgotPasswordSchema),
  AuthController.sendVerificationCode
)
router.post(
  '/verify-code',
  validateRequest(AuthValidation.VerifyCodeSchema),
  AuthController.matchVerificationCode
)

router.post(
  '/reset-password',
  validateRequest(AuthValidation.ResetPasswordSchema),
  AuthController.resetPassword
)

router.post(
  '/change-password',
  authenticate,
  validateRequest(AuthValidation.ChangePasswordSchema),
  AuthController.changePassword
)

export const LoginRoutes = router
