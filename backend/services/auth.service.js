const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDb = require('../config/db');

async function registerUser({ name, email, password }) {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, 'admin', new Date()]
  );

  return { id: result.insertId, name, email, role: 'admin' };
}

async function authenticateUser({ email, password }) {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecret', {
    expiresIn: '7d',
  });
}

module.exports = { registerUser, authenticateUser };
