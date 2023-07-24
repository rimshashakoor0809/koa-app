const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const ErrorHandler = require('./ErrorHandler');
const { generateToken, verifyToken } = require('./TokenHandler');
const User = require('../models/user')


exports.verifyUser = async (ctx, next) => {

  const tokenCookie = ctx.cookies.get('authTokens')
  // console.log('token check:', tokenCookie);

  if (!tokenCookie) {
    return next(ErrorHandler(ctx, { status: 401, message: 'Unauthorized User. No token found👮' }))
  }

  const [accessToken, refreshToken] = tokenCookie.split('|');

  // console.log('Access Token:', accessToken);
  // console.log('Refresh Token:', refreshToken);

  try {

    // console.log('check 1111')
    const decoded = verifyToken(accessToken, process.env.JWT_SECRET);

    // console.log('checking decoded user:', decoded);

    ctx.user = decoded;

    return next();

  } catch (err) {


    // Token verification failed
    if (!refreshToken && err.name === 'TokenExpiredError') {

      console.log('Expired');
      return next(ErrorHandler(ctx, { status: 401, message: 'Token has expired. Please log in again.' }));

    }


    try {

      const decodedRefresh = verifyToken(refreshToken, process.env.JWT_SECRET_REFRESH);


      // If the refresh token is valid, generate a new access token and send it back
      const payload = {
        id: decodedRefresh.id,
        name: decodedRefresh.name,
        email: decodedRefresh.email,
        status: decodedRefresh.status,
      };

      const newAccessToken = generateToken(payload, '15min', process.env.JWT_SECRET);

      ctx.user = payload;

      const combinedTokens = `${newAccessToken}|${refreshToken}`;


      ctx.cookies.set('authTokens', combinedTokens, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1d
        sameSite: 'none',
        // secure: true
      });


      return next();
    }

    catch (refreshErr) {
      console.log('Checking error:', refreshErr)
      return next(ErrorHandler(ctx, { status: 401, message: 'Invalid refresh token. Please log in again.' }));
    }
  }

  // Other errors
  return next(ErrorHandler(ctx, { status: 401, message: 'Invalid token👮' }));
};


