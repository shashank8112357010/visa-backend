const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const {verifyAccessToken} = require("../middlewares/authMiddleware"); // JWT authentication middleware

const router = express.Router();

// Apply JWT auth middleware to protect routes

// Wishlist routes
router.post("/", verifyAccessToken , wishlistController.addToWishlist); // Add to wishlist
router.delete("/:productId", verifyAccessToken , wishlistController.removeFromWishlist); // Remove from wishlist
router.get("/", verifyAccessToken , wishlistController.getWishlist); // Get wishlist

module.exports = router;
