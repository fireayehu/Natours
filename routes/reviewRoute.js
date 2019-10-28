const express = require('express');
const { verifyUser, restrictUser } = require('./../controllers/authController');

const {
  getAllReviews,
  createReview,
  getReview,
  setUserAndTourId,
  updateReview,
  deleteReview
} = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(verifyUser);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictUser('user', 'admin'), setUserAndTourId, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictUser('user', 'admin'), updateReview)
  .delete(restrictUser('user', 'admin'), deleteReview);

module.exports = router;
