const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getTourWithIn,
  getTourDistance
} = require('../controllers/tourController');

const { verifyUser, restrictUser } = require('./../controllers/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.route('/stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    verifyUser,
    restrictUser('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(verifyUser, getTourWithIn);

router
  .route('/tour-distance/:latlng/unit/:unit')
  .get(verifyUser, getTourDistance);

router
  .route('/')
  .get(verifyUser, getAllTours)
  .post(verifyUser, restrictUser('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(verifyUser, restrictUser('admin', 'lead-guide'), updateTour)
  .delete(verifyUser, restrictUser('admin', 'lead-guide'), deleteTour);

module.exports = router;
