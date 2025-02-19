const express = require('express')
const {
  createCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon
} = require('../controllers/couponController')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

// Route to create a coupon (Admin Only)
router.post('/create', authenticate(), authorizeAdmin(), createCoupon)

// Route to apply a coupon during checkout
router.post('/apply', authenticate(), applyCoupon)

// Route to get all active coupons
router.get('/all', authenticate(), authorizeAdmin(), getCoupons)

router.delete('/:id', deleteCoupon)

module.exports = router
