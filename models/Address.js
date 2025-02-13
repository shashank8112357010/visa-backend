const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    landmark: { type: String, required: true },
    zipcode: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Address', addressSchema)
