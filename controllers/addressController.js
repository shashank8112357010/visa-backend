const Address = require('../models/Address')
const { addressValidationSchema } = require('../validation/validation')

// Create an Address
exports.createAddress = async (req, res) => {
  const { error } = addressValidationSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const address = await new Address({ ...req.body, user: req.user.id })
    await address.save()
    res.status(201).json({ success: true, data: address })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// Get all Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find()
    res.status(200).json({ success: true, data: addresses })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// Get an Address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate('user')
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' })

    res.status(200).json({ success: true, data: address })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// Update an Address
exports.updateAddress = async (req, res) => {
  const { error } = addressValidationSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!address)
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' })

    res.status(200).json({ success: true, data: address })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// Delete an Address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id)
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' })

    res
      .status(200)
      .json({ success: true, message: 'Address deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}
