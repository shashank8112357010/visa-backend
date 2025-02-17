const express = require('express');
const {
  createNewsLetter,
  getAllNewsLetters,
  sendNewsletterEmails
} = require('../controllers/newsLetterController');

const router = express.Router();

// Public route - Subscribe to newsletter
router.post('/', createNewsLetter);

// Admin route - Fetch all newsletter subscriptions
router.get('/', getAllNewsLetters);

// Admin route - Send email to all newsletter subscribers
router.post('/send', sendNewsletterEmails);

module.exports = router;
