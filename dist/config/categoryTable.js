"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const createTableQuery = `
 CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
db_1.connection.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating table:', err);
    }
    else {
        console.log('Table created successfully:', result);
    }
    db_1.connection.end();
});
