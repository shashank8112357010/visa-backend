const HelpRequest = require('../models/HelpRequest')
const { helpRequestSchema } = require('../validation/validation')
const { sendMail } = require('../common/sendmail')

exports.createHelpRequest = async (req, res) => {
  const { error } = helpRequestSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const helpRequest = new HelpRequest(req.body)
    await helpRequest.save()

    res.status(201).json({
      success: true,
      message: 'Help request submitted successfully',
      helpRequest
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllHelpRequestByUser = async (req, res) => {
  try {
    const { email } = req.query // Fetch help requests by email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const helpRequests = await HelpRequest.find({ email })
    res.status(200).json({
      success: true,
      message: 'Help requests fetched successfully',
      data: helpRequests
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
    res.status(200).json({
      success: true,
      message: 'Help requests fetched successfully',
      data: helpRequests
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateHelpRequestStatus = async (req, res) => {
  const { helpRequestId } = req.params

  try {
    const helpRequest = await HelpRequest.findById(helpRequestId)
    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' })
    }

    // Update status to "Done"
    helpRequest.status = 'Done'
    await helpRequest.save()

    // Send email notification to user
    const subject = 'Your Help Request has been Resolved'
    const message =
      `Hello ${helpRequest.name},\n\nYour help request regarding "${helpRequest.issue}" has been successfully resolved. Thank you for reaching out to us!\n\nBest regards,\nSupport Team`

    await sendMail(helpRequest.email, subject, message)

    res.status(200).json({
      success: true,
      message: 'Help request marked as done and user notified via email'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteHelpRequest = async (req, res) => {
  const { helpRequestId } = req.params

  try {
    const helpRequest = await HelpRequest.findByIdAndDelete(helpRequestId)
    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Help request deleted successfully'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
