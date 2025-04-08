require('dotenv').config();
const mysql = require('mysql2/promise');

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  console.log('Connected to MySQL for setup!');

  // Create teachers table if not exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS Teachers (
        teacherId INT NOT NULL AUTO_INCREMENT,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip INT,
        phoneNumber VARCHAR(15),
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (teacherId)
    )
  `);

  // Insert two fake teachers if table is empty
  const [rows] = await connection.query('SELECT COUNT(*) AS count FROM Teachers');
  if (rows[0].count === 0) {
    await connection.query(`
      INSERT INTO Teachers (firstName, lastName, email, username, password)
      VALUES 
        ('John', 'Smith', 'j.smith@school.edu', 'jsmith', 'T3acherP@ss1'),
        ('Mary', 'Jones', 'm.jones@school.edu', 'mjones', 'T3acherP@ss2')
    `);
    console.log('Inserted 2 fake teachers.');
  } else {
    console.log('Teachers table already has data. Skipping inserts.');
  }

  await connection.end();
  console.log('Database setup complete.');
}

setup().catch((err) => console.error('Error during setup:', err));
