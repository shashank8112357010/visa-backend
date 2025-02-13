const express = require('express')
const {

  verifyAccessToken,
  isAdmin
} = require('../middlewares/authMiddleware')
const {
  createBlog,
  getAllBlogs,
  deleteBlog,
  getBlogById
} = require('../controllers/blogController')
const upload = require('../config/multer')
const router = express.Router()

router.post(
  '/',
  verifyAccessToken , isAdmin,
  upload.single('image'),
  createBlog
)
router.get('/', getAllBlogs)

// Delete Blog
router.delete('/:id',  verifyAccessToken , isAdmin, deleteBlog)
router.get('/:id', getBlogById)

module.exports = router
