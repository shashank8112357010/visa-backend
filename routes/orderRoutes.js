const express = require("express");
const orderController = require("../controllers/orderController");
const {verifyAccessToken , isAdmin} = require("../middlewares/authMiddleware"); // JWT authentication middleware

const router = express.Router();

// User routes


// User routes
router.post("/", verifyAccessToken, orderController.placeOrder); // Place an order
router.get("/", verifyAccessToken, orderController.getUserOrders); // Get user orders

// Razorpay routes
router.post("/razorpay/order", verifyAccessToken, orderController.createRazorpayOrder); // Create Razorpay order
router.post("/razorpay/verify", verifyAccessToken, orderController.verifyRazorpayPayment); // Verify Razorpay payment

// Admin routes
router.get("/admin/orders", verifyAccessToken, isAdmin, orderController.getAllOrders); // Fetch all orders
router.put("/admin/order/:orderId", verifyAccessToken, isAdmin, orderController.updateOrderStatus); // Update order status


module.exports = router;





