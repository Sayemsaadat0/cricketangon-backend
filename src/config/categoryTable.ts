import {connection} from './db'

const createTableQuery = `
 CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`

connection.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err)
  } else {
    console.log('Table created successfully:', result)
  }
  connection.end()
})
