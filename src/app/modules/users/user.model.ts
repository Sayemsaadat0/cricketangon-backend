import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { UserQueries } from '../../../queries/userQueries'
import { IUser } from './user.interface'

const createUser = (user: IUser): Promise<Partial<IUser>> => {
  const { name, email, password, role, image, address } = user
  return new Promise((resolve, reject) => {
    connection.query(
      UserQueries.CREATE_USER,
      [name, email, password, role, image, address],
      err => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error creating user'
            )
          )
        }
        const newUser = {
          name,
          email,
          role,
          image,
          address,
        }
        resolve(newUser)
      }
    )
  })
}

const getAllUsers = (): Promise<IUser[]> => {
  return new Promise((resolve, reject) => {
    connection.query(UserQueries.GET_ALL_USERS, (err, results) => {
      if (err)
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving users',
            err.stack
          )
        )

      const rows = results as RowDataPacket[]
      if (rows.length === 0) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'No users found'))
      }

      const users = rows.map(row => row as IUser)
      resolve(users)
    })
  })
}

const getUserById = (id: number): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    connection.query(UserQueries.GET_USER_BY_ID, [id], (err, results) => {
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

const updateUser = (
  id: number,
  userUpdates: Partial<IUser>
): Promise<IUser> => {
  const { name, email, password, role, image, address } = userUpdates
  return new Promise((resolve, reject) => {
    connection.query(
      UserQueries.UPDATE_USER,
      [name, email, password, role, image, address, id],
      (err, results) => {
        if (err)
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error updating user',
              err.stack
            )
          )
        const { affectedRows } = results as RowDataPacket
        console.log(affectedRows)
        if (affectedRows === 0) {
          return reject(new ApiError(httpStatus.NOT_FOUND, 'User not found'))
        }
        resolve(affectedRows)
      }
    )
  })
}

const deleteUser = (id: number): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    connection.query(UserQueries.GET_USER_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving user before deletion',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      const user = rows.length > 0 ? (rows[0] as IUser) : null

      if (!user) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'User not found'))
      }

      connection.query(UserQueries.DELETE_USER, [id], deleteErr => {
        if (deleteErr) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error deleting user',
              deleteErr.stack
            )
          )
        }
        resolve(user)
      })
    })
  })
}

export const UserModel = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
