const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser
} = require('../controllers/userController');

const {
  signup,
  login,
  verifyUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', verifyUser, updatePassword);
router.patch('/update', verifyUser, updateCurrentUser);
router.delete('/delete', verifyUser, deleteCurrentUser);

router
  .route('/')
  .get(verifyUser, getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
