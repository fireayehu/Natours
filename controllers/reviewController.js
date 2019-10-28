const { catchAsync } = require('./errorController');
const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.body.user || req.user._id;
  req.body.tour = req.body.tour || req.params.tourId;
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review }
  });
});
