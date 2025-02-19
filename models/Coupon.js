const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Unique coupon code
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    }, // Type of discount
    discountValue: { type: Number, required: true }, // Discount amount
    minPurchase: { type: Number, default: 0 }, // Minimum order value required
    maxDiscount: { type: Number, default: null }, // Max discount for percentage-based coupons
    expiresAt: { type: Date, required: true }, // Expiration date
    isActive: { type: Boolean, default: true }, // Active status
    usageLimit: { type: Number, default: 1 }, // How many times a user can use it
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who have used the coupon
  },
  { timestamps: true }
)

module.exports = mongoose.model('Coupon', couponSchema)
