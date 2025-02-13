const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Product = require('../models/Product')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

// Create a new category (Admin only)
const createCategory = async (req, res) => {
  const { name } = req.body
  console.log(name, 'name')
  try {
    const newCategory = new Category({ name })
    await newCategory.save()
    res
      .status(201)
      .json({ message: 'Category created successfully', category: newCategory })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new subcategory (Admin only)
const createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body

  try {
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const newSubcategory = new SubCategory({ name, category: categoryId })
    await newSubcategory.save()
    res.status(201).json({
      message: 'Subcategory created successfully',
      subcategory: newSubcategory
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params
  console.log(categoryId, 'categoryId')

  try {
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const subcategories = await SubCategory.find({ category: categoryId })
    const subcategoryIds = subcategories.map((sub) => sub._id)

    const products = await Product.find({
      $or: [{ category: categoryId }, { subcategory: { $in: subcategoryIds } }]
    })

    // Delete associated product images
    products.forEach((product) => {
      product.images.forEach((imageUrl) => {
        const filePath = imageUrl.replace(`${process.env.BACKEND_URL}/`, '')
        const absolutePath = path.resolve(filePath)
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      })
    })

    await SubCategory.deleteMany({ category: categoryId })
    await Product.deleteMany({
      $or: [{ category: categoryId }, { subcategory: { $in: subcategoryIds } }]
    })
    await Category.findByIdAndDelete(categoryId)

    res.status(200).json({
      message:
        'Category, associated subcategories, products, and images deleted successfully'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error, please try again later' })
  }
}

const deleteSubcategory = async (req, res) => {
  const { subcategoryId } = req.params
  console.log(subcategoryId, 'subcategoryId')

  try {
    const subcategory = await SubCategory.findById(subcategoryId)

    console.log(subcategory, 'subcategory')
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }

    const products = await Product.find({ subcategory: subcategoryId })

    // Delete associated product images
    products.forEach((product) => {
      product.images.forEach((imageUrl) => {
        const filePath = imageUrl.replace(`${process.env.BACKEND_URL}/`, '')
        console.log(filePath, 'filePath')
        const absolutePath = path.resolve(filePath)
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      })
    })

    await Product.deleteMany({ subcategory: subcategoryId })
    await SubCategory.findByIdAndDelete(subcategoryId)

    res.status(200).json({
      message:
        'Subcategory, associated products, and images deleted successfully'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error, please try again later' })
  }
}

const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Fetch all categories and populate their related subcategories
    const categories = await Category.find().lean() // Use `lean()` for better performance

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        // Fetch subcategories for each category
        const subcategories = await SubCategory.find(
          { category: category._id },
          'name'
        )
        return {
          _id: category._id,
          name: category.name,
          subcategories: subcategories
        }
      })
    )

    res.status(200).json({ categories: categoryData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error, please try again later' })
  }
}

const getSubcategoryByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params
    // Fetch all categories and populate their related subcategories
    const categories = await SubCategory.find({ category: categoryId }).lean() // Use `lean()` for better performance

    res.status(200).json({
      success: true,
      error: false,
      message: 'Fetched',
      data: categories
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error, please try again later' })
  }
}

const getAllSubCategories = async (req, res) => {
  try {
    // Fetch all categories and populate their related subcategories
    const subcategories = await SubCategory.find()
      .populate('category', 'name')
      .lean() // Use `lean()` for better performance

    res.status(200).json({ success: true, error: false, data: subcategories })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error, please try again later' })
  }
}

module.exports = {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  getAllCategoriesWithSubcategories,
  getAllSubCategories,
  getSubcategoryByCategoryId
}
