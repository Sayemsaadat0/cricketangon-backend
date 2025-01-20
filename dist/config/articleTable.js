"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const createArticlesTableQuery = `
 CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  authorName VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  categoryId INT NOT NULL,
  image VARCHAR(255),
  description TEXT,
  userId INT NOT NULL,
  isApproved BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
`;
db_1.connection.query(createArticlesTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating articles table:', err);
    }
    else {
        console.log('Articles table created successfully:', result);
    }
    db_1.connection.end();
});
