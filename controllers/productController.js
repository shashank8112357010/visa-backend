const Product = require('../models/Product')
const { productSchema } = require('../validation/validation')
const Subcategory = require('../models/SubCategory')

const fs = require('fs')
const path = require('path')
// POST: Admin can add products with multiple image uploads
exports.createProduct = async (req, res) => {
  // Parse and normalize incoming data
  const parsedData = {
    ...req.body,
    sizes: Array.isArray(req.body.sizes)
      ? req.body.sizes.filter((size) => size)
      : [req.body.sizes].filter((size) => size),
    colors: Array.isArray(req.body.colors)
      ? req.body.colors.filter((color) => color)
      : [req.body.colors].filter((color) => color)
  }

  delete parsedData.images

  const { error } = productSchema.validate(parsedData)
  if (error) {
    // Remove uploaded files in case of validation error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => fs.unlinkSync(file.path))
    }
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    // Prepare product data for saving
    const productData = {
      ...parsedData,
      images: req.files
        ? req.files
            .map(
              (file) => `${process.env.BACKEND_URL}/uploads/${file.filename}`
            )
            .filter((image) => image) // Filter out any falsy values
        : []
    }

    const product = new Product(productData)
    await product.save()

    res.status(201).json({ message: 'Product added successfully', product })
  } catch (err) {
    // Remove uploaded files in case of server error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => fs.unlinkSync(file.path))
    }
    res.status(500).json({ message: err.message })
  }
}

exports.editProduct = async (req, res) => {
  const { id } = req.params // Product ID from URL params
  console.log(req.body, 'req.body', id)

  const updatedData = { ...req.body }
  const { existingImages } = req.body

  try {
    // Find product by ID
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Update fields if provided
    if (updatedData.name) product.name = updatedData.name
    if (updatedData.price) product.price = updatedData.price
    if (updatedData.fabric) product.fabric = updatedData.fabric
    if (updatedData.description) product.description = updatedData.description

    if (updatedData.sizes) {
      product.sizes = Array.isArray(updatedData.sizes)
        ? updatedData.sizes.filter((size) => size)
        : [updatedData.sizes].filter((size) => size)
    }
    if (updatedData.colors) {
      product.colors = Array.isArray(updatedData.colors)
        ? updatedData.colors.filter((color) => color)
        : [updatedData.colors].filter((color) => color)
    }

    // Handle images correctly
    const newImages = req.files
      ? req.files
          .map((file) => `${process.env.BACKEND_URL}/uploads/${file.filename}`)
          .filter((image) => image) // Filter out any falsy values
      : []

    console.log(newImages, 'newImages')

    // Ensure existingImages is properly parsed into an array
    const parsedExistingImages =
      existingImages && typeof existingImages === 'string'
        ? existingImages.split(',').map((img) => img.trim())
        : Array.isArray(existingImages)
          ? existingImages
          : []

    console.log(parsedExistingImages, 'existingImages')

    // If no new images are uploaded, keep the existing ones
    product.images =
      newImages.length > 0
        ? [...parsedExistingImages, ...newImages]
        : parsedExistingImages

    console.log(product.images, 'final images')

    await product.save()
    res.status(200).json({ message: 'Product updated successfully', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET: Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subcategory', 'name')
    if (!products) {
      res
        .status(204)
        .json({ success: true, data: [], message: 'No data found' })
    }

    res.status(200).json({ success: true, data: products, message: 'Fetched' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET: Fetch all products
exports.getAllProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params
    const subcategory = await Subcategory.find(
      { category: categoryId },
      '_id name'
    )
    console.log(subcategory)
    const products = await Product.find({ category: categoryId })
      .populate('category', 'name')
      .populate('subcategory', 'name')
    if (!products) {
      res
        .status(204)
        .json({ success: true, data: [], message: 'No data found' })
    }

    res.status(200).json({
      success: true,
      data: {
        subcategory,
        products
      },
      message: 'Fetched'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET: Fetch all products with specific fields (id, name, first image)
exports.getAllProductsName = async (req, res) => {
  try {
    console.log('in this')
    const products = await Product.find({}, 'name _id images')
      .populate('category', 'name')
      .populate('subcategory', 'name')
    if (!products) {
      res
        .status(204)
        .json({ success: true, data: products, message: 'No data found' })
    }

    res.status(200).json({ success: true, data: products, message: 'Fetched' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Increment viewCount
    await Product.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } })

    res.status(200).json({ success: true, data: product, message: 'Fetched' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE: Admin can delete a product and its associated images
exports.deleteProduct = async (req, res) => {
  try {
    // Fetch the product by ID
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Delete images from the server if they exist
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          `../uploads/${image.split('/uploads/')[1]}`
        )
        // Check if the image file exists and then remove it
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      })
    }

    // Delete the product from the database
    await product.deleteOne()

    res
      .status(200)
      .json({ message: 'Product and its images deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET: Fetch trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    // Define the time range for trending (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Fetch trending products based on weighted criteria (salesCount + viewCount)
    const trendingProducts = await Product.find({
      trending: true // Products added or viewed in the last 7 days
    })
      .populate('category', 'name')
      .populate('subcategory', 'name')

      .limit(6) // Fetch top 10 trending products

    if (!trendingProducts || trendingProducts.length === 0) {
      return res.status(204).json({
        success: true,
        data: [],
        message: 'No trending products found'
      })
    }

    res.status(200).json({
      success: true,
      data: trendingProducts,
      message: 'Trending products fetched successfully'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params // Get product ID from URL
    const { available } = req.body // Get stock value from request body

    // Validate request
    if (typeof available !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for available. It should be true or false.'
      })
    }

    // Find product and update stock
    const product = await Product.findByIdAndUpdate(
      productId,
      { inStock: available },
      { new: true, runValidators: true }
    )

    // Check if product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Stock updated successfully'
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.updateTrending = async (req, res) => {
  try {
    const { productId } = req.params // Get product ID from URL
    const { trending } = req.body // Get stock value from request body

    // Validate request
    if (typeof trending !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for trending. It should be true or false.'
      })
    }

    // Find product and update stock
    const product = await Product.findByIdAndUpdate(
      productId,
      { trending: trending },
      { new: true, runValidators: true }
    )

    // Check if product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Trending updated successfully'
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
