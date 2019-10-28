const { catchAsync } = require('./errorController');
const Review = require('./../models/reviewModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./../utils/factoryHandler');

exports.setUserAndTourId = (req, res, next) => {
  req.body.user = req.body.user || req.user._id;
  req.body.tour = req.body.tour || req.params.tourId;
  next();
};

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
