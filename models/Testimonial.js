const mongoose = require('mongoose')
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true, default: 'Lucknow, India' },
    rating: { type: Number, required: true, default: 3 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)
