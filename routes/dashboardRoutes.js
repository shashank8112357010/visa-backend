const express = require('express');
const router = express.Router();

// Import your models
const HelpRequest = require('../models/helpModel');
const Order = require('../models/orderModel');
const {Product , Category} = require('../models/productModel');
const User = require('../models/userModel');
const { isAdmin, verifyAccessToken } = require('../middlewares/authMiddleware');

// Route to fetch counts and last updated timestamps of various collections
router.get('/count', verifyAccessToken, isAdmin, async (req, res) => {
    try {

        const helpRequestCount = await HelpRequest.countDocuments();
        const helpRequestLastUpdated = await HelpRequest.findOne().sort({ updatedAt: -1 }).select('updatedAt');

        const orderCount = await Order.countDocuments();
        const orderLastUpdated = await Order.findOne().sort({ updatedAt: -1 }).select('updatedAt');

        const productCount = await Product.countDocuments();


        const productLastUpdated = await Product.findOne().sort({ updatedAt: -1 }).select('updatedAt');
        const categoryCount = await Category.countDocuments();
        const categoryLastUpdated = await Category.findOne().sort({ updatedAt: -1 }).select('updatedAt');


        const userCount = await User.countDocuments();
        const userLastUpdated = await User.findOne().sort({ updatedAt: -1 }).select('updatedAt');

        // Return the counts and last updated timestamps as a JSON response
        return res.status(200).json({
            success: true,
            data: {
                help: { count: helpRequestCount, lastUpdated: helpRequestLastUpdated ? helpRequestLastUpdated.updatedAt : null },
                order: { count: orderCount, lastUpdated: orderLastUpdated ? orderLastUpdated.updatedAt : null },
                product: { count: productCount, lastUpdated: productLastUpdated ? productLastUpdated.updatedAt : null },
                category: { count: categoryCount, lastUpdated: categoryLastUpdated ? categoryLastUpdated.updatedAt : null },
                user: { count: userCount, lastUpdated: userLastUpdated ? userLastUpdated.updatedAt : null },
            }
        });
    } catch (error) {
        console.error('Error fetching counts and last updated:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch counts and last updated timestamps'
        });
    }
});

module.exports = router;
