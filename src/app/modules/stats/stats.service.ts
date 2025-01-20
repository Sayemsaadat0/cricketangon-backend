import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IStats } from './stats.interface'
import { StatsModel } from './stats.model'
import { IStatsFilter } from './stats.constant'

const createStats = async (stats: IStats, file?: Express.Multer.File): Promise<Partial<IStats>> => {
    try {
      if (file) {
        stats.image = `/uploads/${file.filename}`; 
      }
  
      const newStats = await StatsModel.createStat(stats);
      return newStats;
    } catch (error) {
      console.error('Error creating stats:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating stats');
    }
  };

const getAllStats = async (
  filters: IStatsFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IStats[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)

    const whereConditions: string[] = []
    const queryParams: any[] = []

    if (searchTerm) {
      const searchConditions = ['title', 'description', 'authorName', "description"]
        .map(field => `${field} LIKE ?`)
        .join(' OR ')
      whereConditions.push(`(${searchConditions})`)
      queryParams.push(`%${searchTerm}%`)
    }

    if (Object.keys(filtersData).length > 0) {
      Object.entries(filtersData).forEach(([field, value]) => {
        whereConditions.push(`${field} = ?`)
        queryParams.push(value)
      })
    }

    const sortConditions =
      sortBy && ['id', 'title'].includes(sortBy)
        ? `ORDER BY ${sortBy} ${sortOrder || 'asc'}`
        : ''

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    const query = `SELECT id, title,image, created_at, updated_at, authorName, description FROM stats ${whereClause} ${sortConditions} LIMIT ? OFFSET ?`
    queryParams.push(limit, skip)



    const [results] = await connection.promise().query(query, queryParams)
    const stats = results as RowDataPacket[]

    const mappedStats: IStats[] = stats.map(row => ({
      id: row.id,
      authorName: row.authorName,
      title: row.title,
      image: row.image,
      description: row.description,
      created_at : row.created_at ,
      updated_at : row.updated_at
    }))

    const countQuery = `SELECT COUNT(*) AS total FROM stats ${whereClause}`
    const countParams = queryParams.slice(0, -2)
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
      data: mappedStats,
    }
  } catch (error) {
    console.error('Error in getAllStats:', error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve stats'
    )
  }
}

const getStatsById = async (id: number): Promise<Partial<IStats | null>> => {
  try {
    const stats = await StatsModel.getStatById(id)
    if (!stats) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stats not found')
    }
    return stats
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error retrieving stats'
    )
  }
}

const updateStats = async (
    id: number,
    statsUpdates: Partial<IStats>,
    file?: Express.Multer.File
  ): Promise<IStats> => {
    try {
      if (file) {
        statsUpdates.image = `/uploads/${file.filename}`;
      }
  
      const stats = await StatsModel.updateStat(id, statsUpdates); 
      if (!stats) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Stats not found');
      }
  
      const updatedStats = await StatsModel.getStatById(id);
      if (!updatedStats) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching updated stats');
      }
  
      return updatedStats;
    } catch (error) {
      console.error('Error updating stats:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating stats');
    }
  };

const deleteStats = async (id: number): Promise<IStats> => {
  try {
    const stats = await StatsModel.deleteStat(id)
    if (!stats) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stats not found')
    }
    return stats
  } catch (error) {
    console.error('Error deleting stats:', error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting stats')
  }
}

export const StatsService = {
  createStats,
  getAllStats,
  getStatsById,
  updateStats,
  deleteStats,
}
