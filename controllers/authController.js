const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');

const getToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email or Password missing', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Invalid Email or Password', 401));
  }

  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = getToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

exports.verifyUser = catchAsync(async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Your not logged in', 401));
  }

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(id);
  if (!user) {
    return next(
      new AppError('The user related to the token no longer exists', 401)
    );
  }

  if (user.isPasswordUpdated(iat)) {
    return next(
      new AppError('The user password has been changed after logged in', 401)
    );
  }

  req.user = user;
  next();
});
