const express = require('express');
const router = express.Router();
const { createCategory, createSubcategory, createProduct, editProduct, deleteProduct, getAllProducts, getProductsByCategoryId } = require('../controllers/productController');
const upload = require('../config/multer'); // Multer configuration
const { verifyAccessToken, isAdmin } = require('../middlewares/authMiddleware');


// Product Routes
router.post('/', verifyAccessToken, isAdmin, upload.array('images', 5), createProduct); // Upload 5 images for a product
router.put('/:id', verifyAccessToken, isAdmin, upload.array('images', 5), editProduct); // Edit product with images
router.delete('/:id', verifyAccessToken, isAdmin, deleteProduct);
router.get('/category/:categoryId', getProductsByCategoryId);




// Get all products for users
router.get('/' ,  getAllProducts);



module.exports = router;
