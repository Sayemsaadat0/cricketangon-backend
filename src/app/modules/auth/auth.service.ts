import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'

import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'
import { AuthModel } from './auth.model'
import connection from '../../../config/db';
import { UserQueries } from '../../../queries/userQueries';
import { RowDataPacket } from 'mysql2';
import { IUser } from '../users/user.interface';
import { sendEmail } from './auth.constant';

type IResponseMessage={
  message:string;
}
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload

  try {
    const user = await AuthModel.getUserByEmail(email)

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password did not match')
    }

    const accessToken = jwtHelpers.createToken(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      config.jwt_secret as string,
      config.jwt_expires_in as string
    )

    const refreshToken = jwtHelpers.createToken(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    )

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed')
  }
}

const refreshAccessToken = async (
  refreshToken: string
): Promise<IRefreshTokenResponse> => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string
    )
    if (!decoded || typeof decoded !== 'object' || !decoded.email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
    }

    const { email, role, id } = decoded
    const newAccessToken = jwtHelpers.createToken(
      { email, role, id },
      config.jwt_secret as string,
      config.jwt_expires_in as string
    )

    return {
      accessToken: newAccessToken,
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to refresh token')
  }
}


const sendVerificationCode = async (email: string):Promise<IResponseMessage> => {
  return new Promise((resolve, reject) => {
    connection.query(UserQueries.FIND_USER_BY_EMAIL, [email], async (err, results) => {
      if (err)
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving user',
            err.stack
          )
        )
        const rows = results as RowDataPacket[]
        const user = rows.length > 0 ? (rows[0] as IUser) : null
        if (!user) {
          return reject(new ApiError(httpStatus.NOT_FOUND, 'User not found'))
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
      connection.query(
        `INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
        [email, verificationCode],
        async (insertErr) => {
          if (insertErr) {
            return reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to save reset request'));
          }

          await sendEmail(email, 'Your Password Reset Code', `Your verification code is: ${verificationCode}`);

          resolve({ message: 'Verification code sent successfully' });
        }
      );
    });
  });
};


export const AuthService = {
  loginUser,
  refreshAccessToken,
  sendVerificationCode
}
