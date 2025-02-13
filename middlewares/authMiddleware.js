const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const verifyAccessToken = (req, res, next) => {
  const token = req?.header('Authorization').split(' ')[1]
  if (!token) {
    return res?.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach the userId from the token to the request
    next();
  } catch (error) {
    res?.status(403).json({ message: "Invalid or expired access token" });
  }
};

// Admin authorization middleware
const isAdmin = async (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res?.status(403).json({ message: "Access denied, Admins only" });
    }
    next();
  } catch (error) {
    res?.status(500).json({ message: error.message });
  }
};

module.exports = { verifyAccessToken, isAdmin };
