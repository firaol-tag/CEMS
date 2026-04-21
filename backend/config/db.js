const mysql = require('mysql');
const { promisify } = require('util');

let pool;

async function connectDb() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cems',
    connectionLimit: 10,
  });

  // Promisify the query method
  pool.query = promisify(pool.query).bind(pool);

  await pool.query('SELECT 1');
  console.log('Connected to MySQL');
  return pool;
}

module.exports = connectDb;
