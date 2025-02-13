const express = require("express");
const {addToCart , IncreaseDecreaseFromCart , removeFromCart , getCart} = require("../controllers/cartController");
const {verifyAccessToken} = require("../middlewares/authMiddleware"); // JWT authentication middleware

const router = express.Router();



// Cart routes
router.post("/",  verifyAccessToken ,addToCart); // Add to cart
router.put("/updatequantity",  verifyAccessToken , IncreaseDecreaseFromCart); // Decrease quantity
router.delete("/remove/:productId", verifyAccessToken , removeFromCart); // Remove product from cart
router.get("/",verifyAccessToken , getCart); // Get cart details

module.exports = router;
