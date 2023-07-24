const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ErrorHandler = require('./ErrorHandler');

exports.generateToken = (payload, expiryTime, secret) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiryTime,
  });
};

exports.verifyToken = (token, secret,next) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return next(ErrorHandler(ctx, { status: 401, message: 'Token Verification Failed. No token found👮' }))
  }
};

exports.hashedToken = (token) => {
  return crypto.createHash('sha256').update(token.toString()).digest('hex');
};
