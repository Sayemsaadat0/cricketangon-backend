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

const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
})

const VerifyCodeSchema=z.object({
  body:z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    code: z.string({
      required_error: 'Verification code is required',
    }),
  })
})
const ResetPasswordSchema=z.object({
  body:z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
  })
})
const ChangePasswordSchema=z.object({
  body:z.object({
    oldPassword: z.string({
      required_error: 'Old Password is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
  })
})
export const AuthValidation = {
  LoginZodSchema,
  refreshTokenZodSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyCodeSchema,
  ChangePasswordSchema
}
