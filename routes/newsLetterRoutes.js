const express = require('express')
const {
  createNewsLetter,
  getAllNewsLetters,
  sendNewsletterEmails,
  unsubscribeNewsLetter
} = require('../controllers/newsLetterController')

const router = express.Router()

// Public route - Subscribe to newsletter
router.post('/', createNewsLetter)

// Admin route - Fetch all newsletter subscriptions
router.get('/', getAllNewsLetters)

// Admin route - Send email to all newsletter subscribers
router.post('/send', sendNewsletterEmails)

router.post('/unsubscribe', unsubscribeNewsLetter) // ✅ Unsubscribe API

module.exports = router
