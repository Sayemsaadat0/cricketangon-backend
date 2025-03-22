"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
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
