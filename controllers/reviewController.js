const Review = require('../models/Review')
const { reviewSchema } = require('../validation/validation')

exports.createReview = async (req, res) => {
  // Validate request body using Joi

  try {
    // Handle optional image
    const imagePath = req.file
      ? `${process.env.BACKEND_URL}/furniture_uploads/${req.file.filename}`
      : 'N/A'

    // Create a new review instance
    const reviewData = {
      ...req.body,
      image: imagePath // Use uploaded image if available, else default to 'N/A'
    }

    const review = new Review(reviewData)
    await review.save()

    res.status(201).json({ message: 'Review created successfully', review })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isPublished: false })
    res.json({ message: 'Review fetched successfully', data: reviews })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Fetch all reviews for the given product
    const reviews = await Review.find({ product: productId })

    res.json({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviews
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    )
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json({ message: 'Review approved successfully', review })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    // Attempt to find and delete the review by ID
    const review = await Review.findByIdAndDelete(req.params.reviewId)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.status(200).json({ message: 'Review deleted successfully', review })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


exports.getRecentReviews = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Default to 10 recent reviews
    const reviews = await Review.find()
      .populate('product', 'name') // Populate product name
      .sort({ createdAt: -1 }) // Sort by latest
      .limit(parseInt(limit)); // Limit results

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

