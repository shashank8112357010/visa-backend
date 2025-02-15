const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
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
  upload.array('images', 15), // Allow up to 15 images
  createProduct
)

router.get('/', getAllProducts)
router.get('/individual/:id', getProductById)
router.delete('/:id', authenticate(), authorizeAdmin(), deleteProduct)
router.put('/stock/:productId', authenticate(), authorizeAdmin(), updateStock)

router.put(
  '/:id',
  authenticate(),
  authorizeAdmin(),
  upload.array('images', 15), // Allow up to 15 images
  editProduct
)

router.put(
  '/trending/:productId',
  authenticate(),
  authorizeAdmin(),
  updateTrending
)

module.exports = router
