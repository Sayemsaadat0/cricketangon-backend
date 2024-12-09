/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import jwt from "jsonwebtoken"
import { jwtHelpers } from "../../../helper/jwtHelper";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import connection from "../../../config/db";
const query = promisify(connection.query).bind(connection);

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;
  
    const userQuery = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const results: any[] = await query(userQuery, [email]);

    if (results.length === 0) {
        throw new Error('User does not exist');
      }
  
      const user = results[0];
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE,'Invalid email or password');
      }
    
      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
    
      const refreshToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        'your_jwt_refresh_secret',
        { expiresIn: '7d' }
      );
  

  
    return {
      accessToken,
      refreshToken,
      needsPasswordChange: user.needsPasswordChange,
    };
  };