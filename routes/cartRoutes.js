const express = require('express')
const {
  addToCart,
  IncreaseDecreaseFromCart,
  removeFromCart,
  getCart
} = require('../controllers/cartController.js')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

// Cart routes
router.post('/', authenticate(), addToCart) // Add to cart
router.put('/updatequantity', authenticate(), IncreaseDecreaseFromCart) // Decrease quantity
router.delete('/remove/:productId', authenticate(), removeFromCart) // Remove product from cart
router.get('/', authenticate(), getCart) // Get cart details

module.exports = router
