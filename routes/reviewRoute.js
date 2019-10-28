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

router
  .route('/')
  .get(verifyUser, getAllReviews)
  .post(verifyUser, restrictUser('user'), setUserAndTourId, createReview)
  .patch(verifyUser, updateReview)
  .delete(verifyUser, deleteReview);

router.route('/:id').get(verifyUser, getReview);

module.exports = router;
