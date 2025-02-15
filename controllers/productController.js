const Product = require('../models/Product')
const { productSchema } = require('../validation/validation')
const Subcategory = require('../models/SubCategory')
const fs = require('fs')
const path = require('path')

// ✅ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      images: req.files
        ? req.files.map(
            (file) =>
              `${process.env.BACKEND_URL}/furniture_uploads/${file.filename}`
          )
        : []
    }
    const product = new Product(productData)
    await product.save()

    res
      .status(201)
      .json({ success: true, message: 'Product added successfully', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ EDIT PRODUCT
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = { ...req.body }

    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (req.files) {
      updatedData.images = req.files.map(
        (file) =>
          `${process.env.BACKEND_URL}/furniture_uploads/${file.filename}`
      )
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      updatedProduct
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          `../furniture_uploads/${image.split('/furniture_uploads/')[1]}`
        )
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      })
    }

    await product.deleteOne()
    res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      'category subcategory',
      'name'
    )
    res.status(200).json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category subcategory',
      'name'
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })

    res.status(200).json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ UPDATE STOCK STATUS
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params
    const { inStock } = req.body
    const product = await Product.findByIdAndUpdate(
      productId,
      { inStock },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res
      .status(200)
      .json({ success: true, message: 'Stock status updated', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ UPDATE TRENDING STATUS
exports.updateTrending = async (req, res) => {
  try {
    const { productId } = req.params
    const { trending } = req.body
    const product = await Product.findByIdAndUpdate(
      productId,
      { trending },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res
      .status(200)
      .json({ success: true, message: 'Trending status updated', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ UPDATE BESTSELLER STATUS
exports.updateBestSeller = async (req, res) => {
  try {
    const { productId } = req.params
    const { bestsellor } = req.body
    const product = await Product.findByIdAndUpdate(
      productId,
      { bestsellor },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res
      .status(200)
      .json({ success: true, message: 'Bestseller status updated', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ UPDATE NEW ARRIVAL STATUS
exports.updateNewArrival = async (req, res) => {
  try {
    const { productId } = req.params
    const { newarrival } = req.body
    const product = await Product.findByIdAndUpdate(
      productId,
      { newarrival },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res
      .status(200)
      .json({ success: true, message: 'New Arrival status updated', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
