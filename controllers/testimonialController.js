const Testimonial = require('../models/Testimonial')

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  // const { error } = testimonialSchema.validate(req.body)
  // if (error) return res.status(400).json({ message: error.details[0].message })
  const image = req.file && req.file.mimetype.includes('image') 
  ? `${process.env.BACKEND_URL}/${req.file.path}` 
  : null; // Null if no valid image
  try {
    const testimonialData = {
      ...req.body,
      image: image
    }

    const testimonial = new Testimonial(testimonialData)
    await testimonial.save()
    res
      .status(201)
      .json({ message: 'Testimonial added successfully', testimonial })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
    if (!testimonials) {
      return res
        .status(204)
        .json({ success: true, message: 'No testimonials found', data: [] })
    }
    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: testimonials
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  const { testimonialId } = req.params

  try {
    // Find the testimonial by ID
    const testimonial = await Testimonial.findById(testimonialId)
    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found.' })
    }

    // Delete the testimonial
    await Testimonial.findByIdAndDelete(testimonialId)

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
