import mysql from 'mysql2';

export const connection = mysql.createConnection({
  host: 'localhost',           
  user: 'root',         
  password: '',     
  database: 'cricketangon',     
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database Successfully.');
});


