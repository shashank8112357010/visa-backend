const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createHelpRequest,
  getAllHelpRequests,
  updateHelpRequestStatus,
  deleteHelpRequest,
  getAllHelpRequestByUser
} = require('../controllers/helpRequestController')

const router = express.Router()

// Public route (No authentication needed)
router.post('/', createHelpRequest)

// Public route (Fetch by email query param)
router.get('/users', getAllHelpRequestByUser)

// Admin routes
router.get('/', authenticate(), authorizeAdmin(), getAllHelpRequests)
router.put('/status/:helpRequestId', authenticate(), authorizeAdmin(), updateHelpRequestStatus)
router.delete('/:helpRequestId', authenticate(), authorizeAdmin(), deleteHelpRequest)

module.exports = router
