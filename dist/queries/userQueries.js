"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueries = void 0;
exports.UserQueries = {
    CREATE_USER: `
    INSERT INTO users (name, email, password, role, image, address, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `,
    GET_USER_BY_ID: `
    SELECT id, name, email, role, image, address, created_at, updated_at FROM users WHERE id = ?
  `,
    UPDATE_USER: `
    UPDATE users
    SET name = ?, email = ?, password = ?, role = ?, image = ?, address = ?, updated_at = NOW()
    WHERE id = ?
  `,
    DELETE_USER: `
    DELETE FROM users WHERE id = ?
  `,
    GET_ALL_USERS: `
    SELECT id, name, email, role, image, address, created_at, updated_at FROM users
  `,
    FIND_USER_BY_EMAIL: `
    SELECT id, name, email, password, role, image, address, created_at, updated_at FROM users WHERE email = ?
  `,
};
