const Banner = require('../models/Banner')
const path = require('path')
const fs = require('fs')

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

    res
      .status(201)
      .json({ message: 'Banner created successfully', banner: newBanner })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
    res.status(200).json({ banners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteBanner = async (req, res) => {
  try {
    // Fetch the banner by ID
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // Extract the image filename if it's stored as a URL
    if (banner.image) {
      const imagePath = path.join(
        __dirname,
        `../furniture_uploads/${banner.image.split('/furniture_uploads/')[1]}`
      )

      // Check if file exists before deleting
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

    res.status(200).json({ message: 'Banner and image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
module.exports = { createBanner, getAllBanners, deleteBanner }
