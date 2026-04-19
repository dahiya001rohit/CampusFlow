const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_key_change_me', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
