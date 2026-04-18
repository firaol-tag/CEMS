const { registerUser, authenticateUser } = require('../services/auth.service');

async function register(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({ user, message: 'Admin user created' });
}

async function login(req, res) {
  const token = await authenticateUser(req.body);
  res.json({ token });
}

module.exports = { register, login };
