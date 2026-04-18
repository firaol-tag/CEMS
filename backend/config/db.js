const mysql = require('mysql2/promise');

let pool;

async function connectDb() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cems',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  await pool.query('SELECT 1');
  console.log('Connected to MySQL');
  return pool;
}

module.exports = connectDb;
