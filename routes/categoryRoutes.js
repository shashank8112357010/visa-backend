const express = require('express')
const router = express.Router()
const {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  getAllCategoriesWithSubcategories,
  getAllSubCategories,
  getSubcategoryByCategoryId
} = require('../controllers/categoryController')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

// Category Routes
router.post('/', authenticate(), authorizeAdmin(), createCategory)

// Subcategory Routes
router.post('/subcategory', authenticate(), authorizeAdmin(), createSubcategory)

// DELETE /api/categories/:categoryId - Admin only
router.delete('/:categoryId', authenticate(), authorizeAdmin(), deleteCategory)

// DELETE /api/subcategories/:subcategoryId - Admin only
router.delete(
  '/subcategory/:subcategoryId',
  authenticate(),
  authorizeAdmin(),
  deleteSubcategory
)

// GET /api/categories - Fetch all categories with their subcategories
router.get('/', getAllCategoriesWithSubcategories)
router.get('/subcategory', getAllSubCategories)
router.get(`/:categoryId/subcategory`, getSubcategoryByCategoryId)

module.exports = router
