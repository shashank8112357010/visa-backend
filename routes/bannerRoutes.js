const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createBanner,
  getAllBanners,
  deleteBanner
} = require('../controllers/bannerController')
const upload = require('../common/multer')
const router = express.Router()

// Create a banner (Admin only)
router.post(
  '/',
  authenticate(),
  authorizeAdmin(),
  upload.single('image'),
  createBanner
)

// Get all banners
router.get('/', getAllBanners)

// Delete a banner (Admin only)
router.delete('/:id', authenticate(), authorizeAdmin(), deleteBanner)

module.exports = router
