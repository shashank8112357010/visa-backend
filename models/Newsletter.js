const mongoose = require('mongoose')

const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    subscribedAt: { type: Date, default: Date.now }, // Stores when the user subscribed
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active'
    } // Allows users to unsubscribe later
  },
  { timestamps: true }
)

module.exports = mongoose.model('NewsLetter', newsLetterSchema)
