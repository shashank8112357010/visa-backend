const mongoose = require('mongoose')

const VisaApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  currentAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },

  // Passport Details
  passportNumber: { type: String, required: true },
  passportExpiry: { type: Date, required: true },

  // Travel Details
  visaType: { type: String, required: true },
  arrivalDate: { type: Date, required: true },

  // Uploaded Documents
  passportCopy: { type: String, default: 'N/A' },
  photograph: { type: String, default: 'N/A' },

  nationality: { type: String },

  // Payment Details
  amount: { type: Number, required: true }, // Visa fee
  paymentStatus: {
    type: String,
    enum: ['pending_payment', 'paid'],
    default: 'pending_payment'
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Application Processing Details
  applicationStatus: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
})



module.exports = mongoose.model('VisaApplication', VisaApplicationSchema)