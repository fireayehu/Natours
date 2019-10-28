const express = require('express');
const { verifyUser, restrictUser } = require('./../controllers/authController');

const {
  getAllReviews,
  createReview
} = require('./../controllers/reviewController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(verifyUser, getAllReviews)
  .post(verifyUser, restrictUser('user'), createReview);

module.exports = router;
