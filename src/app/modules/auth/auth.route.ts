import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.LoginZodSchema),
  AuthController.loginUser
)
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', validateRequest(AuthValidation.ForgotPasswordSchema), AuthController.sendVerificationCode);

export const LoginRoutes = router
