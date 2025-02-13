const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createProduct,
  getAllProducts,
  getProductById,
  getAllProductsName,
  deleteProduct,
  getAllProductsByCategoryId,
  getTrendingProducts,
  updateStock,
  updateTrending,
  editProduct
} = require('../controllers/productController')
const upload = require('../common/multer')
const router = express.Router()

// Routes
router.post(
  '/',
  authenticate(),
  authorizeAdmin(),
  upload.array('images', 5),
  createProduct
) // Allow up to 5 images
router.get('/', getAllProducts)
router.get('/id', getAllProductsName)

router.get('/trending', getTrendingProducts)

router.get('/:categoryId', getAllProductsByCategoryId)

// router.get('/id', getAllProducts)

router.get('/individual/:id', getProductById)

router.delete('/:id', authenticate(), authorizeAdmin(), deleteProduct)

router.put('/stock/:productId', authenticate(), authorizeAdmin(), updateStock)

router.put(
  '/:id',
  authenticate(),
  authorizeAdmin(),
  upload.array('images', 5),
  editProduct
)

router.put(
  '/trending/:productId',
  authenticate(),
  authorizeAdmin(),
  updateTrending
)

module.exports = router
