const express = require('express')
const upload = require('../common/multer.js')
const {
  createVisaApplication,
  handlePaymentWebhook,
  verifyPayment,
  getAllVisaApplications, // Admin: Get all visa applications
  updateVisaApplicationStatus, // Admin: Update visa application status
  trackVisaApplication // User: Track visa application status by mobile number
} = require('../controllers/visaController.js')

const router = express.Router()

// Routes
router.post(
  '/',
  upload.fields([{ name: 'passportCopy' }, { name: 'photograph' }]),
  createVisaApplication
)
router.post('/razorpay-webhook', express.json(), handlePaymentWebhook)
router.post('/verify-payment', verifyPayment)

// Admin APIs
router.get('/', getAllVisaApplications) // Get all applications
router.put('/:id', updateVisaApplicationStatus) // Update application status

// User API
router.get('/track/:mobileNumber', trackVisaApplication) // Track application by mobile number

// Export the router
module.exports = router
