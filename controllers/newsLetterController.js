const NewsLetter = require('../models/Newsletter')
const { sendMail } = require('../common/sendmail')

// ✅ Create Newsletter Subscription
exports.createNewsLetter = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email is required' })

  try {
    // Check if email already exists
    const existingSubscriber = await NewsLetter.findOne({ email })
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email is already subscribed' })
    }

    const newsletter = new NewsLetter({ email })
    await newsletter.save()

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully',
      newsletter
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ Fetch All Newsletter Subscriptions
exports.getAllNewsLetters = async (req, res) => {
  try {
    const subscribers = await NewsLetter.find()
    res.status(200).json({
      success: true,
      message: 'Newsletter subscribers fetched successfully',
      data: subscribers
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ Send Email to All Subscribers
exports.sendNewsletterEmails = async (req, res) => {
  const { subject, message } = req.body
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' })
  }

  try {
    const subscribers = await NewsLetter.find()
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No subscribers found' })
    }

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      await sendMail(subscriber.email, subject, message)
    }

    res.status(200).json({
      success: true,
      message: 'Newsletter emails sent successfully'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
