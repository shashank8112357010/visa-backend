const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, default: 3 },
    message: { type: String, required: true },
    image: { type: String, default: 'N/A' },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
