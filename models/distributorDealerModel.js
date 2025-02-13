const mongoose = require('mongoose');

const distributorDealerSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  enquire: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const distributorDealer = mongoose.model('DistributorDealer', distributorDealerSchema);

module.exports = distributorDealer;
