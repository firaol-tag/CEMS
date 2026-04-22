const { registerUser, authenticateUser } = require('../services/auth.service');

module.exports = {
  register: (req, res) => {
    registerUser(req.body, (err, user) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      authenticateUser(req.body, (err, token) => {
        if (err) {
          return res.status(err.status || 500).json({ message: err.message });
        }
        res.status(201).json({ token, message: 'Admin user created' });
      });
    });
  },
  login: (req, res) => {
    authenticateUser(req.body, (err, token) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json({ token });
    });
  }
};
