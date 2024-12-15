import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
  
    const result = await AuthService.loginUser(loginData);
  
    const { refreshToken, ...others } = result;
  
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };
  
    res.cookie('refreshToken', refreshToken, cookieOptions);
  
    if ('refreshToken' in result) {
        delete result.refreshToken
      }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: others,
    });
  });


  const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required');
    }
    const result = await AuthService.refreshAccessToken(refreshToken);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  const sendVerificationCode = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log(email)
    const result = await AuthService.sendVerificationCode(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
    });
  });
  const matchVerificationCode = catchAsync(async (req: Request, res: Response) => {
    const { email, code } = req.body
    const result = await AuthService.matchVerificationCode(email, code)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
    })
  })

  const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body
    const result = await AuthService.resetPassword(email, newPassword)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
    })
  })

  const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body
    const user= req.user;
    const userId=user?.user?.id;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }
    const result = await AuthService.changePassword(userId, oldPassword, newPassword)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
    })
  })
  
  
  export const AuthController={
    loginUser,
    refreshToken,
    sendVerificationCode,
    matchVerificationCode,
    resetPassword,
    changePassword
  }