import {connection} from './db'

const createTableQuery = `
 CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
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
