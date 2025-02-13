const express = require("express");
const addressController = require("../controllers/addressController");
const {verifyAccessToken} = require("../middlewares/authMiddleware"); // JWT authentication middleware

const router = express.Router();

// Apply auth middleware to protect routes

// Address routes
router.post("/", verifyAccessToken , addressController.createAddress); // Create an address
router.get("/", verifyAccessToken , addressController.getAddresses); // Get all addresses
router.get("/:addressId",  verifyAccessToken , addressController.getAddressById); // Get a specific address
router.put("/:addressId",  verifyAccessToken , addressController.updateAddress); // Update an address
router.delete("/:addressId", verifyAccessToken , addressController.deleteAddress); // Delete an address

module.exports = router;
