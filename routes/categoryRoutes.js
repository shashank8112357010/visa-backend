const express = require('express');
const router = express.Router();
const { createCategory, createSubcategory, deleteCategory, deleteSubcategory, getAllCategoriesWithSubcategories, getAllSubCategories, getSubcategoryByCategoryId, getAllCategories } = require('../controllers/productController');
const upload = require('../config/multer'); // Multer configuration
const { verifyAccessToken, isAdmin } = require('../middlewares/authMiddleware');

// Category Routes
router.post('/', verifyAccessToken, isAdmin, upload.single('image') , createCategory);

// Subcategory Routes
router.post('/subcategory', verifyAccessToken, isAdmin, upload.single('image')  , createSubcategory);

// DELETE /api/categories/:categoryId - Admin only
router.delete('/:categoryId', verifyAccessToken, isAdmin, deleteCategory);


// DELETE /api/subcategories/:subcategoryId - Admin only
router.delete('/subcategory/:subcategoryId', verifyAccessToken, isAdmin, deleteSubcategory);


// GET /api/categories - Fetch all categories with their subcategories
router.get('/categoryandsubcategpry', getAllCategoriesWithSubcategories);
router.get('/', getAllCategories);


router.get('/subcategory', getAllSubCategories)
router.get(`/:categoryId/subcategory`, getSubcategoryByCategoryId)






module.exports = router;
