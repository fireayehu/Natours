const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser
} = require('../controllers/userController');

const {
  signup,
  login,
  verifyUser,
  restrictUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(verifyUser);

router.get('/profile', getCurrentUser, getUser);
router.patch('/updatePassword', updatePassword);
router.patch('/update', updateCurrentUser);
router.delete('/delete', deleteCurrentUser);

router.use(restrictUser('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
