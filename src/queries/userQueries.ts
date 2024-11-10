export const UserQueries = {
    CREATE_USER: `
      INSERT INTO users (name, email, password, role, image, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
  
    GET_USER_BY_ID: `
      SELECT * FROM users WHERE id = ?
    `,
  
    UPDATE_USER: `
      UPDATE users
      SET name = ?, email = ?, password = ?, role = ?, image = ?, address = ?
      WHERE id = ?
    `,
  
    DELETE_USER: `
      DELETE FROM users WHERE id = ?
    `,
  
    GET_ALL_USERS: `
      SELECT * FROM users
    `
  };

 
  