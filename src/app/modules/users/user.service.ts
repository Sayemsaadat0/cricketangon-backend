/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import { connection } from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IUserFilter, UserSearchableFields } from './user.constant'
import { IUser } from './user.interface'
import { UserModel } from './user.model'

const createUser = async (user: IUser,file?:Express.Multer.File): Promise<Partial<IUser>> => {
  try {
    if(file){
      user.image=`/uploads/${file.filename}`
    }
    const emailCheckQuery = `SELECT * FROM users WHERE email = ?`
    const [existingUser] = await connection
      .promise()
      .query(emailCheckQuery, [user.email])

    if ((existingUser as RowDataPacket[]).length > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists')
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 12)
      user.password = hashedPassword
      const newUser = await UserModel.createUser(user)
      return newUser
    }
  } catch (error: any) {
    if (error.statusCode === 409) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists')
    }
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating user')
  }
}

const getAllUsers = async (
  filters: IUserFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)

    const whereConditions: string[] = []
    const queryParams: any[] = []

    if (searchTerm) {
      const searchConditions = UserSearchableFields.map(
        field => `${field} LIKE ?`
      ).join(' OR ')
      whereConditions.push(`(${searchConditions})`)
      queryParams.push(...UserSearchableFields.map(() => `%${searchTerm}%`))
    }

    if (Object.keys(filtersData).length > 0) {
      Object.entries(filtersData).forEach(([field, value]) => {
        whereConditions.push(`${field} = ?`)
        queryParams.push(value)
      })
    }

    const sortConditions =
      sortBy && ['id', 'name', 'email', 'role'].includes(sortBy)
        ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
        : ''

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    const query = `SELECT id, name, email, role, image, address FROM users ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`
    queryParams.push(limit, skip)



    const [results] = await connection.promise().query(query, queryParams)
    const users = results as RowDataPacket[]

    const mappedUsers: IUser[] = users.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      image: row.image,
      address: row.address,
    }))

    const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`
    const countParams = queryParams.slice(0, -2)
    console.log('Count Query:', countQuery)

    const [countResults] = await connection
      .promise()
      .query(countQuery, countParams)
    const total = (countResults as RowDataPacket[])[0].total

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: mappedUsers,
    }
  } catch (error) {
    console.error('Error in getAllUsers:', error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve users'
    )
  }
}

const getUserById = async (id: number): Promise<Partial<IUser | null>> => {
  try {
    const user = await UserModel.getUserById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    const { password, ...userWithoutPassword } = user
    console.log(password)
    return userWithoutPassword
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error retrieving user'
    )
  }
}

const updateUser = async (
  id: number,
  userUpdates: Partial<IUser>,
  file?:Express.Multer.File
): Promise<IUser> => {
  try {
    if(file){
      userUpdates.image=`/uploads/${file.filename}`
    }
    const fields = Object.keys(userUpdates)
      .filter(key => userUpdates[key as keyof IUser] !== undefined)
      .map(key => `${key} = ?`)

    const values = Object.values(userUpdates).filter(
      value => value !== undefined
    )
    values.push(id)

    if (fields.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No updates provided')
    }

    const query = `UPDATE users SET ${fields.join(
      ', '
    )}, updated_at = NOW() WHERE id = ?`

    const [updateResult] = await connection.promise().query(query, values)
    const { affectedRows } = updateResult as { affectedRows: number }

    if (affectedRows === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    const [rows] = await connection.promise().query<RowDataPacket[]>(
      `SELECT id, name, email, role, image, address, updated_at 
      FROM users 
      WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching updated user'
      )
    }

    const updatedUser = rows[0]
    const { password, ...responseUser } = updatedUser
    console.log(password)
    return responseUser as IUser
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error updating user',
      error instanceof Error ? error.stack : ''
    )
  }
}
const deleteUser = async (id: number): Promise<IUser> => {
  try {
    const user = await UserModel.deleteUser(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    console.log(error, ' line 231')
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting user')
  }
}

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
