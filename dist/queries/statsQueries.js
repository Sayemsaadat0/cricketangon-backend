"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsQueries = void 0;
exports.StatsQueries = {
    CREATE_STAT: `
      INSERT INTO stats (authorName, title, image, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
    GET_STAT_BY_ID: `
      SELECT id, authorName, title, image, description, created_at, updated_at 
      FROM stats 
      WHERE id = ?
    `,
    UPDATE_STAT: `
      UPDATE stats
      SET authorName = ?, title = ?, image = ?, description = ?, updated_at = NOW()
      WHERE id = ?
    `,
    DELETE_STAT: `
      DELETE FROM stats WHERE id = ?
    `,
    GET_ALL_STATS: `
      SELECT id, authorName, title, image, description, created_at, updated_at 
      FROM stats
    `,
    FIND_STATS_BY_AUTHOR: `
      SELECT id, authorName, title, image, description, created_at, updated_at 
      FROM stats 
      WHERE authorName = ?
    `,
};
