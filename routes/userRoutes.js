const express = require('express')
const {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword,
  getUsers
} = require('../controllers/userController')
const {
  authorizeAdmin,
  authenticate
} = require('../middlewares/authMiddleware')
const router = express.Router()

// User Routes
router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/forget-password', forgetUser)
router.post('/auth/reset-password', resetPassword)
router.get('/users', authenticate(), authorizeAdmin(), getUsers)

module.exports = router
