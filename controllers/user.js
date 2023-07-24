const bcryptjs = require('bcryptjs');
const { generateToken } = require('../utils/TokenHandler');
const ErrorHandler = require('../utils/ErrorHandler');
const { Model } = require('objection');
const { Op } = require('objection');
const User = require('../models/user');

exports.signUpUser = async (ctx, next) => {
  try {

    const { name, email, password } = ctx.request.body;

    // Validation

    if (!name || !email || !password) {

      return next(ErrorHandler(ctx, { status: 400, message: 'Please fill in all the required fields.' }));
    }

    if (password.length < 8) {
      return next(ErrorHandler(ctx, { status: 400, message: 'Password must contain at least 8 characters' }));
    }

    // Check if user exists

    const isUserExits = await User.query().findOne({ email });

    if (isUserExits) {
      return next(ErrorHandler(ctx, { status: 400, message: 'This email already exists' }))
    }

    // Password Hashing
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.query().insert({
      name,
      email,
      password: hashedPassword
    })

    ctx.status = 200;
    ctx.body = newUser;

  } catch (error) {
    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to register new account😞' }))
  }
}

exports.loginUser = async (ctx, next) => {
  try {

    const { email, password } = ctx.request.body;

    // Validation

    if (!email || !password) {

      return next(ErrorHandler(ctx, { status: 400, message: 'Please fill in all the required fields.' }));
    }

    if (password.length < 8) {
      return next(ErrorHandler(ctx, { status: 400, message: 'Password must contain at least 8 characters' }));
    }

    // Check if user exists
    const user = await User.query().findOne({ email });

    if (!user) {
      return next(ErrorHandler(ctx, { status: 404, message: 'User not found' }));
    }

    // Comparing Password

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(ErrorHandler(ctx, { status: 404, message: 'Password does not match. Try Again.' }));
    }

    // Changing Status to true
    user.status = true;
    await user.$query().patch();

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    const accessToken = generateToken(payload, '15min', process.env.JWT_SECRET);
    const refreshToken = generateToken(payload, '7d', process.env.JWT_SECRET_REFRESH);

    const combinedTokens = `${accessToken}|${refreshToken}`;

    ctx.cookies.set('authTokens', combinedTokens, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1d
      sameSite: 'none',
      // secure: true,
    });

    ctx.status = 200;
    ctx.body = {
      user,
      accessToken,
      refreshToken,
    };


  } catch (error) {
    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 500, message: 'Server Error: Something went wrong, try again😥' }))
  }
}