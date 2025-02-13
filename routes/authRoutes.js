const express = require("express");
const router = express.Router();

const { registerUser, loginUser, forgotPassword, resetPassword, refreshToken } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password/:email", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

module.exports = router;
