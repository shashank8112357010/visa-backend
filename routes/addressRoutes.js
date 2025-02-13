const express = require('express')
const router = express.Router()
const addressController = require('../controllers/addressController')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
// CRUD Routes
router.post('/', authenticate(), addressController.createAddress) // Create Address
router.get('/', authenticate(), addressController.getAddresses) // Get All Addresses
router.get('/:id', authenticate(), addressController.getAddressById) // Get Address by ID
router.put('/:id', authenticate(), addressController.updateAddress) // Update Address
router.delete('/:id', authenticate(), addressController.deleteAddress) // Delete Address

module.exports = router
