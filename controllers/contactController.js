const Contact = require('../models/Contact')

// @desc Create a new contact request
// @route POST /api/contact
// @access Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, message, phone, subject } = req.body
    const contact = new Contact({ name, email, phone, message, subject })
    await contact.save()
    res
      .status(201)
      .json({ message: 'Contact request submitted successfully', contact })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Get all contact requests (Admin)
// @route GET /api/contact
// @access Admin
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.status(200).json(contacts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Update contact status (Admin)
// @route PUT /api/contact/:id
// @access Admin
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.status(200).json({ message: 'Status updated successfully', contact })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Delete a contact request (Admin)
// @route DELETE /api/contact/:id
// @access Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    await contact.deleteOne()

    res.status(200).json({ message: 'Contact deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
