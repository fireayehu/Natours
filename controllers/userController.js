const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');
const {
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./../utils/factoryHandler');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).map(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getCurrentUser = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update.', 400));
  }
  const filterdObj = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user._id, filterdObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ status: 'success', data: { user } });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This /signup end point for creating user'
  });
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
