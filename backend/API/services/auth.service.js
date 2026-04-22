const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDb = require('../../config/db');
module.exports = {
  registerUser: (data, callback) => {
    const { name, email, password } = data;
    connectDb.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length) {
        return callback(new Error('Email already registered'));
      }
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
        connectDb.query('INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, 'admin', new Date()], (err, result) => {
          if (err) {
            return callback(err);
          }
          return callback(null, { id: result.insertId, name, email, role: 'admin' });
        });
      });
    });
  },
  authenticateUser: (data, callback) => {
    const { email, password } = data;
    connectDb.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (!results.length) {
        return callback(new Error('Invalid credentials'));
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, valid) => {
        if (err) {
          return callback(err);
        }
        if (!valid) {
          return callback(new Error('Invalid credentials'));
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
        return callback(null, token);
      });
    });
  }
};
