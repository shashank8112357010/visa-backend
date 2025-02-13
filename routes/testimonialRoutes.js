const express = require('express')
const {
  verifyAccessToken,
  isAdmin
} = require('../middlewares/authMiddleware')
const {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial
} = require('../controllers/testimonialController')
const upload = require('../config/multer')
const router = express.Router()

// Create a new testimonial
router.post(
  '/',
  verifyAccessToken , isAdmin,
  upload.single('image'),
  createTestimonial
)

// Get all testimonials
router.get('/', getAllTestimonials)

// Delete a testimonial (only accessible by admin)
router.delete(
  '/:testimonialId',
  verifyAccessToken , isAdmin,
  deleteTestimonial
)

module.exports = router
