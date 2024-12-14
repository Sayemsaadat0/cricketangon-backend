import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'

import { ILoginUser, ILoginUserResponse } from './auth.interface'
import { AuthModel } from './auth.model'

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  try {
    const user = await AuthModel.getUserByEmail(email)

    console.log(user, "line 35");
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password did not match');
    }

    const accessToken = jwtHelpers.createToken(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      config.jwt_secret as string,
      config.jwt_expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed');
  }
};

export const AuthService={
  loginUser
}
