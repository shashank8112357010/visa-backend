const Banner = require('../models/Banner')
const path = require('path')
const fs = require('fs')
const redis = require('../common/redis') // Import Redis from common

const BANNER_CACHE_KEY = 'banners' // Cache key for banners

// Create a new banner
const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const newBanner = new Banner({
      image: `${process.env.BACKEND_URL}/furniture_uploads/${req.file.filename}`
    })
    await newBanner.save()

    // Clear cached banners
    await redis.del(BANNER_CACHE_KEY)

    res
      .status(201)
      .json({ message: 'Banner created successfully', banner: newBanner })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all banners (with caching)
const getAllBanners = async (req, res) => {
  try {
    const cachedBanners = await redis.get(BANNER_CACHE_KEY)
    if (cachedBanners) {
      return res.json({ success: true, banners: JSON.parse(cachedBanners) })
    }

    const banners = await Banner.find({})
    await redis.set(BANNER_CACHE_KEY, JSON.stringify(banners), 'EX', 86400) // Cache for 24 hours

    res.status(200).json({ banners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // Delete the image file if exists
    if (banner.image) {
      const imagePath = path.join(
        __dirname,
        `../furniture_uploads/${banner.image.split('/furniture_uploads/')[1]}`
      )

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath)
        } catch (err) {
          console.error('Error deleting image:', err)
        }
      }
    }

    // Delete the banner from the database
    await banner.deleteOne()

    // Clear cached banners
    await redis.del(BANNER_CACHE_KEY)

    res.status(200).json({ message: 'Banner and image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createBanner, getAllBanners, deleteBanner }
