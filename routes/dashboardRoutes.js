const express = require('express')
const router = express.Router()

// Import your models
const Blog = require('../models/Blog')
const HelpRequest = require('../models/HelpRequest')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Testimonial = require('../models/Testimonial')
const User = require('../models/User')
const Review = require('../models/Review') // Added Review model
const Category = require('../models/Category') // Added Category model
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

// Route to fetch counts and last updated timestamps of various collections
router.get('/count', authenticate(), authorizeAdmin(), async (req, res) => {
  try {
    // Count the number of documents and get the last updated time for each collection
    const blogCount = await Blog.countDocuments()
    const blogLastUpdated = await Blog.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const helpRequestCount = await HelpRequest.countDocuments()
    const helpRequestLastUpdated = await HelpRequest.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const orderCount = await Order.countDocuments()
    const orderLastUpdated = await Order.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const productCount = await Product.countDocuments()
    const productLastUpdated = await Product.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const testimonialCount = await Testimonial.countDocuments()
    const testimonialLastUpdated = await Testimonial.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const userCount = await User.countDocuments()
    const userLastUpdated = await User.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    // New additions
    const reviewCount = await Review.countDocuments({ isPublished: true })
    const reviewLastUpdated = await Review.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    const categoryCount = await Category.countDocuments()
    const categoryLastUpdated = await Category.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt')

    // Return the counts and last updated timestamps as a JSON response
    return res.status(200).json({
      success: true,
      data: {
        blog: {
          count: blogCount,
          lastUpdated: blogLastUpdated ? blogLastUpdated.updatedAt : null
        },
        help: {
          count: helpRequestCount,
          lastUpdated: helpRequestLastUpdated
            ? helpRequestLastUpdated.updatedAt
            : null
        },

        order: {
          count: orderCount,
          lastUpdated: orderLastUpdated ? orderLastUpdated.updatedAt : null
        },
        product: {
          count: productCount,
          lastUpdated: productLastUpdated ? productLastUpdated.updatedAt : null
        },

        testimonial: {
          count: testimonialCount,
          lastUpdated: testimonialLastUpdated
            ? testimonialLastUpdated.updatedAt
            : null
        },
        user: {
          count: userCount,
          lastUpdated: userLastUpdated ? userLastUpdated.updatedAt : null
        },
        review: {
          count: reviewCount,
          lastUpdated: reviewLastUpdated ? reviewLastUpdated.updatedAt : null
        },
        category: {
          count: categoryCount,
          lastUpdated: categoryLastUpdated
            ? categoryLastUpdated.updatedAt
            : null
        }
      }
    })
  } catch (error) {
    console.error('Error fetching counts and last updated:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch counts and last updated timestamps'
    })
  }
})

module.exports = router
