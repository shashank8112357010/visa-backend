const express = require('express')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')
const {
  createReview,
  getPendingReviews,
  approveReview,
  deleteReview,
  getReviewsByProductId,
  getRecentReviews
} = require('../controllers/reviewController')
const upload = require('../common/multer')

const router = express.Router()

router.post('/', upload.single('image'), createReview)
router.get('/', authenticate(), authorizeAdmin(), getPendingReviews)
router.get('/:productId', getReviewsByProductId)
router.get('/recent', getRecentReviews);

router.patch('/:id', authenticate(), authorizeAdmin(), approveReview)
router.delete('/:reviewId', authenticate(), authorizeAdmin(), deleteReview)

module.exports = router
