const express = require('express')
const router = express.Router()
const {
  createOrder,
  getUserOrders,
  markOrderAsDelivered,
  deleteOrder,
  getAllOrders
} = require('../controllers/orderController')
const {
  authenticate,
  authorizeAdmin
} = require('../middlewares/authMiddleware')

// Routes
router.post('/', authenticate(), createOrder) // Place an order
router.get('/', authenticate(), authorizeAdmin(), getAllOrders) // Place an order

router.get('/user/:userId', authenticate(), getUserOrders) // Get orders for a user

// Mark an order as delivered
router.put(
  '/status/:orderId',
  authenticate(),
  authorizeAdmin(),
  markOrderAsDelivered
)

// Delete an order (if placed wrong)
router.delete('/:orderId', authenticate(), deleteOrder)

module.exports = router
