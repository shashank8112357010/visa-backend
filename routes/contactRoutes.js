const express = require('express')
const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController')

const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', createContact) // Public route for users
router.get('/', authenticate(), authorizeAdmin(), getAllContacts) // Admin-only: View all contacts
router.put('/:id', authenticate(), authorizeAdmin(), updateContactStatus) // Admin-only: Update status
router.delete('/:id', authenticate(), authorizeAdmin(), deleteContact) // Admin-only: Delete a contact

module.exports = router
