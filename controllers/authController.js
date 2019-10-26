const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');
const sendEmail = require('./../utils/email');

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

exports.restrictUser = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Your are not authorized to do this operation', 403)
      );
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  const token = user.setPasswordRestToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;
  const message = `Forgot your password? send a PATCH request to this url ${resetUrl} if you did not forgot your password ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfuly'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('The was error sending the email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired token', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;

  await user.save();

  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (
    !user ||
    !(await user.verifyPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError('Invalid current password', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});
