import {connection} from './db'

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
`

connection.query(createStatsTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating stats table:', err)
  } else {
    console.log('Stats table created successfully:', result)
  }
  connection.end()
})
