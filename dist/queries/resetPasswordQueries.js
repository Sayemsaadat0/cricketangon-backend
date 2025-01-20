"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordQueries = void 0;
exports.ResetPasswordQueries = {
    INSERT_PASSWORD_RESET: `
      INSERT INTO password_resets (email, code, expires_at, created_at)
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), NOW())
    `,
    GET_PASSWORD_RESET_BY_EMAIL_AND_CODE: `
      SELECT * FROM password_resets
      WHERE email = ? AND code = ? AND expires_at > NOW()
    `,
    DELETE_PASSWORD_RESET_BY_EMAIL: `
      DELETE FROM password_resets
      WHERE email = ?
    `,
    FIND_USER_BY_EMAIL: `
      SELECT id, name, email, password, role, image, address, created_at, updated_at
      FROM users
      WHERE email = ?
    `,
    UPDATE_USER_PASSWORD: `
      UPDATE users
      SET password = ?, updated_at = NOW()
      WHERE email = ?
    `,
};
