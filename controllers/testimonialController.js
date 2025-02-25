const Testimonial = require('../models/Testimonial')
const redis = require('../common/redis') // Assuming Redis client is set up

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const testimonialData = {
      ...req.body,
      image: `${process.env.BACKEND_URL}/visa_uploads/${req.file.filename}` // Store the image path in the database
    }

    const testimonial = new Testimonial(testimonialData)
    await testimonial.save()

    // Clear cache after adding a new testimonial
    await redis.del('testimonials')

    res
      .status(201)
      .json({ message: 'Testimonial added successfully', testimonial })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all testimonials (with Redis caching)
exports.getAllTestimonials = async (req, res) => {
  try {
    // Check if testimonials are in cache
    const cachedTestimonials = await redis.get('testimonials')

    if (cachedTestimonials) {
      return res.status(200).json({
        success: true,
        message: 'Testimonials fetched from cache',
        data: JSON.parse(cachedTestimonials)
      })
    }

    // If not in cache, fetch from DB
    const testimonials = await Testimonial.find()

    if (!testimonials.length) {
      return res
        .status(204)
        .json({ success: true, message: 'No testimonials found', data: [] })
    }

    // Store in Redis for 3 hours
    await redis.set('testimonials', JSON.stringify(testimonials), 'EX', 10800)

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
    const testimonial = await Testimonial.findById(testimonialId)
    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found.' })
    }

    // Delete the testimonial
    await Testimonial.findByIdAndDelete(testimonialId)

    // Clear cache after deleting a testimonial
    await redis.del('testimonials')

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
