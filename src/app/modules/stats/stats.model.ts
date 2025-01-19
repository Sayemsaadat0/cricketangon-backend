import httpStatus from 'http-status';
import { RowDataPacket } from 'mysql2';
import {connection} from '../../../config/db';
import ApiError from '../../../errors/ApiError';
import { IStats } from './stats.interface';
import { StatsQueries } from '../../../queries/statsQueries';

const createStat = (stat: IStats): Promise<Partial<IStats>> => {
  const { authorName, title, image, description } = stat;
  return new Promise((resolve, reject) => {
    connection.query(
      StatsQueries.CREATE_STAT,
      [authorName, title, image, description],
      (err) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error creating stat',
              err.stack
            )
          );
        }
        const newStat = { authorName, title, image, description };
        resolve(newStat);
      }
    );
  });
};

const getAllStats = (): Promise<IStats[]> => {
  return new Promise((resolve, reject) => {
    connection.query(StatsQueries.GET_ALL_STATS, (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving stats',
            err.stack
          )
        );
      }

      const rows = results as RowDataPacket[];
      if (rows.length === 0) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'No stats found'));
      }

      const stats = rows.map((row) => row as IStats);
      resolve(stats);
    });
  });
};

const getStatById = (id: number): Promise<IStats | null> => {
  return new Promise((resolve, reject) => {
    connection.query(StatsQueries.GET_STAT_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving stat',
            err.stack
          )
        );
      }

      const rows = results as RowDataPacket[];
      const stat = rows.length > 0 ? (rows[0] as IStats) : null;

      if (!stat) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Stat not found'));
      }

      resolve(stat);
    });
  });
};

const updateStat = (
  id: number,
  statUpdates: Partial<IStats>
): Promise<IStats> => {
  const { authorName, title, image, description } = statUpdates;
  return new Promise((resolve, reject) => {
    connection.query(
      StatsQueries.UPDATE_STAT,
      [authorName, title, image, description, id],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error updating stat',
              err.stack
            )
          );
        }
        const { affectedRows } = results as RowDataPacket;
        if (affectedRows === 0) {
          return reject(new ApiError(httpStatus.NOT_FOUND, 'Stat not found'));
        }
        resolve(affectedRows);
      }
    );
  });
};

const deleteStat = (id: number): Promise<IStats> => {
  return new Promise((resolve, reject) => {
    connection.query(StatsQueries.GET_STAT_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving stat before deletion',
            err.stack
          )
        );
      }

      const rows = results as RowDataPacket[];
      const stat = rows.length > 0 ? (rows[0] as IStats) : null;

      if (!stat) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Stat not found'));
      }

      connection.query(StatsQueries.DELETE_STAT, [id], (deleteErr) => {
        if (deleteErr) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error deleting stat',
              deleteErr.stack
            )
          );
        }
        resolve(stat);
      });
    });
  });
};

export const StatsModel = {
  createStat,
  getAllStats,
  getStatById,
  updateStat,
  deleteStat,
};
