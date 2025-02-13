const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
    currency: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
