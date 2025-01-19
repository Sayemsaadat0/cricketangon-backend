"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryQueries = void 0;
exports.CategoryQueries = {
    CREATE_CATEGORY: `
      INSERT INTO categories (name, image, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `,
    GET_CATEGORY_BY_ID: `
      SELECT id, name, image, created_at, updated_at FROM categories WHERE id = ?
    `,
    UPDATE_CATEGORY: `
      UPDATE categories
      SET name = ?, image = ?, updated_at = NOW()
      WHERE id = ?
    `,
    DELETE_CATEGORY: `
      DELETE FROM categories WHERE id = ?
    `,
    GET_ALL_CATEGORIES: `
      SELECT id, name, image, created_at, updated_at FROM categories
    `,
};
