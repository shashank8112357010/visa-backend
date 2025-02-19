const Coupon = require('../models/Coupon')
const Product = require('../models/Product')
const Order = require('../models/Order') // Assume you have an Order schema

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expiresAt,
      usageLimit
    } = req.body

    const existingCoupon = await Coupon.findOne({ code })
    if (existingCoupon)
      return res.status(400).json({ message: 'Coupon code already exists' })

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expiresAt,
      usageLimit
    })

    await coupon.save()
    res.status(201).json({ message: 'Coupon created successfully', coupon })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body
    const userId = req.user.id

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true })
    if (!coupon)
      return res.status(400).json({ message: 'Invalid or expired coupon' })

    // Check if the coupon is expired
    if (new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ message: 'Coupon has expired' })
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of ₹${coupon.minPurchase} required`
      })
    }

    // Check if the user has already used the coupon
    if (coupon.usedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Coupon already used by this user' })
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount // Cap the discount at maxDiscount
      }
    } else {
      discount = coupon.discountValue
    }

    // Mark coupon as used
    coupon.usedBy.push(userId)
    await coupon.save()

    res.json({
      message: 'Coupon applied successfully',
      discount,
      newTotal: cartTotal - discount
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true })
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params

    const coupon = await Coupon.findById(id)
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    await Coupon.findByIdAndDelete(id)
    res.json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
