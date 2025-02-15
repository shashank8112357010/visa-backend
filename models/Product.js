const mongoose = require('mongoose')
// isNewArrival;
// isBestSeller;
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    price: { type: Number, required: true },
    colors: [{ type: String }],
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
    },
    newarrival: { type: String, required: true },
    bestsellor: { type: String, required: false },
    trending: { type: Boolean, required: true },
    inStock: { type: Boolean, default: true },
    discount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
