const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    issueType: {
      type: String,
      enum: ['Contact Us', 'Rent Your Property', 'Franchise', 'Complaints'],
      required: true
    },
    issue: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HelpRequest', helpSchema);
