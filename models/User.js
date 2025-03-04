const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    subscribe: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], default: 'admin' }, // Role field with default value
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
