const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    price: { type: Number, required: true },
    sizes: [{ type: String }],
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
    stock: { type: Number, required: true, default: 0 },
    fabric: { type: String, required: true },
    trending: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    salesCount: { type: Number, default: 0 }, // To track purchases
    inStock: { type: Boolean, default: true }, // To track purchases
    discount: { type: Number, default: 0 }, // To track purchases
    viewCount: { type: Number, default: 0 } // To track views
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
