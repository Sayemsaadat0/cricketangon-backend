"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const LoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
const ForgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
    }),
});
const VerifyCodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        code: zod_1.z.string({
            required_error: 'Verification code is required',
        }),
    })
});
const ResetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
    })
});
const ChangePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old Password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
    })
});
exports.AuthValidation = {
    LoginZodSchema,
    refreshTokenZodSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    VerifyCodeSchema,
    ChangePasswordSchema
};
