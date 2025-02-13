const express = require('express')
const {
  verifyAccessToken,
  isAdmin
} = require('../middlewares/authMiddleware')
const {
  createBanner,
  getAllBanners,
  deleteBanner
} = require('../controllers/bannerController')
const upload = require('../config/multer')
const router = express.Router()

// Create a banner (Admin only)
router.post(
  '/',
  verifyAccessToken,
  isAdmin,
  upload.single('image'),
  createBanner
)

// Get all banners
router.get('/', getAllBanners)

// Delete a banner (Admin only)
router.delete('/:id', verifyAccessToken, isAdmin, deleteBanner)

module.exports = router
