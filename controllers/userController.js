const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();
  const users = await features.query;

  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Api end point is not ready'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Api end point is not ready'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Api end point is not ready'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Api end point is not ready'
  });
};
