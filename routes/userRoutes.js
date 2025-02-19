const express = require('express');
const {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword,
  getUsers,
  toggleSubscribe,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { authorizeAdmin, authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// User Authentication Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forget-password', forgetUser);
router.post('/auth/reset-password', resetPassword);

// User Management Routes
router.get('/users', authenticate(), authorizeAdmin(), getUsers);
router.patch('/toggle-subscribe', authenticate(), toggleSubscribe);
router.put('/update-profile', authenticate(), updateProfile);
router.post('/change-password', authenticate(), changePassword);

module.exports = router;
