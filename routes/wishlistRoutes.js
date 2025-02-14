const express = require('express')
const wishlistController = require('../controllers/wishlistController')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

// Apply JWT auth middleware to protect routes

// Wishlist routes
router.post('/', authenticate(), wishlistController.addToWishlist) // Add to wishlist
router.delete(
  '/:productId',
  authenticate(),
  wishlistController.removeFromWishlist
) // Remove from wishlist
router.get('/', authenticate(), wishlistController.getWishlist) // Get wishlist

module.exports = router
