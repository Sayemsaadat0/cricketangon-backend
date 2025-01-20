import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'

import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import { UserQueries } from '../../../queries/userQueries'
import { IUser } from '../users/user.interface'
import { sendEmail } from './auth.constant'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'
import { AuthModel } from './auth.model'

type IResponseMessage = {
  message: string
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
        image:user.image,
        address:user.address
      },
      config.jwt_secret as string,
      config.jwt_expires_in as string
    )

    const refreshToken = jwtHelpers.createToken(
      {
        email: user.email,
        role: user.role,
        id: user.id,
        image:user.image,
        address:user.address
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

const sendVerificationCode = async (
  email: string
): Promise<IResponseMessage> => {
  return new Promise((resolve, reject) => {
    connection.query(
      UserQueries.FIND_USER_BY_EMAIL,
      [email],
      async (err, results) => {
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

        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString()
        connection.query(
          `INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
          [email, verificationCode],
          async insertErr => {
            if (insertErr) {
              return reject(
                new ApiError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  'Failed to save reset request'
                )
              )
            }

            await sendEmail(
              email,
              'Your Password Reset Code',
              `Your verification code is: ${verificationCode}`
            )

            resolve({ message: 'Verification code sent successfully' })
          }
        )
      }
    )
  })
}
const matchVerificationCode = async (
  email: string,
  code: string
): Promise<IResponseMessage> => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()`,
      [email, code],
      async (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error verifying code',
              err.stack
            )
          )
        }
        const rows = results as RowDataPacket[]
        if (rows.length === 0) {
          return reject(
            new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired code')
          )
        }
        resolve({ message: 'Verification code matched successfully' })
      }
    )
  })
}

const resetPassword = async (
  email: string,
  newPassword: string
): Promise<IResponseMessage> => {
  const user = await AuthModel.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found')
  }
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 12)
    connection.query(
      `UPDATE users SET password = ? WHERE email = ?`,
      [hashedPassword, email],
      async (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error resetting password',
              err.stack
            )
          )
        }
        console.log(results)
        connection.query(
          `DELETE FROM password_resets WHERE email = ?`,
          [email],
          err => {
            if (err) {
              return reject(
                new ApiError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  'Error clearing reset codes',
                  err.stack
                )
              )
            }
            resolve({ message: 'Password reset successfully' })
          }
        )
      }
    )
  })
}

const changePassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<IResponseMessage> => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT password FROM users WHERE id = ?`,
      [userId],
      async (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error retrieving user password',
              err.stack
            )
          )
        }
        const rows = results as RowDataPacket[]
        if (rows.length === 0) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
        const currentHashedPassword = rows[0].password
        const isMatch = bcrypt.compare(oldPassword, currentHashedPassword)
        if (!isMatch) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Old password is incorrect'
          )
        }
        const hashedNewPassword = bcrypt.hashSync(newPassword, 12)

        connection.query(
          `UPDATE users SET password = ? WHERE id = ?`,
          [hashedNewPassword, userId],
          (updateErr, updateResults) => {
            if (updateErr) {
              return reject(
                new ApiError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  'Error updating password',
                  updateErr.stack
                )
              )
            }
            console.log(updateResults)
            resolve({ message: 'Password changed successfully' })
          }
        )
      }
    )
  })
}

export const AuthService = {
  loginUser,
  refreshAccessToken,
  sendVerificationCode,
  matchVerificationCode,
  resetPassword,
  changePassword
}
