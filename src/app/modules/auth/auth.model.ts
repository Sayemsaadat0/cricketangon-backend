import httpStatus from "http-status"
import {connection} from "../../../config/db"
import ApiError from "../../../errors/ApiError"
import { UserQueries } from "../../../queries/userQueries"
import { IUser } from "../users/user.interface"
import { RowDataPacket } from "mysql2"

const getUserByEmail = (email: string): Promise<IUser | null> => {
    return new Promise((resolve, reject) => {
      connection.query(UserQueries.FIND_USER_BY_EMAIL, [email], (err, results) => {
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
        resolve(user)
      })
    })
  }

 


  export const AuthModel={
    getUserByEmail,
  }