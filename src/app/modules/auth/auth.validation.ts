import { z } from 'zod'
const LoginZodSchema = z.object({
    body: z.object({
      email: z.string({
        required_error: 'Email is required',
      }),
      password: z.string({
        required_error: 'Password is required',
      }),
    }),
  })
  
  const refreshTokenZodSchema = z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'Refresh token is required',
      }),
    }),
  })
  const changePasswordZodSchema = z.object({
    body: z.object({
      oldPassword: z.string({
        required_error: 'old Password is required',
      }),
      newPassword: z.string({
        required_error: 'New Password is required',
      }),
    }),
  })
  const forgetPasswordZodSchema = z.object({
    body: z.object({
      newPassword: z.string({
        required_error: 'New Password is required',
      }),
    }),
  })
  const verify2FAZodSchema = z.object({
    body: z.object({
      verificationCode: z.number({
        required_error: 'Verification code is required',
      }),
    }),
  })

  export const AuthValidation = {
    LoginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
    forgetPasswordZodSchema,
    verify2FAZodSchema,
  }
  