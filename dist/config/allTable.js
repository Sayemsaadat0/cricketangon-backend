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
const createPhotosTableQuery = `
  CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    category ENUM('regular', 'moment') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;
db_1.connection.query(createPhotosTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating photos table:', err);
    }
    else {
        console.log('Photos table created successfully:', result);
    }
    db_1.connection.end();
});
const createResetPasswordTableQuery = `
 CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
db_1.connection.query(createResetPasswordTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating table:', err);
    }
    else {
        console.log('Table created successfully:', result);
    }
    db_1.connection.end();
});
const createStatsTableQuery = `
  CREATE TABLE IF NOT EXISTS stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorName VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;
db_1.connection.query(createStatsTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating stats table:', err);
    }
    else {
        console.log('Stats table created successfully:', result);
    }
    db_1.connection.end();
});
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'super_admin') NOT NULL,
    image VARCHAR(255) NULL,
    address TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;
db_1.connection.query(createUserTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating table:', err);
    }
    else {
        console.log('Table created successfully:', result);
    }
    db_1.connection.end();
});
