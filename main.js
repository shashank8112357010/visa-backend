const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const cors = require('cors')

// Route imports
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const helpRoutes = require('./routes/helpRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes')
const blogRoutes = require('./routes/blogRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const categoryRoutes = require('./routes/categoryRoutes.js')
const cartRoutes = require('./routes/cartRoutes.js')
const wishlistRoutes = require('./routes/wishlistRoutes.js')
const addressRoutes = require('./routes/addressRoutes.js')
const bannerRoutes = require('./routes/bannerRoutes.js')
const contactRoutes = require('./routes/contactRoutes.js')

const app = express()
app.use(cors({}))

app.use(bodyParser.json())
app.use(
  '/furniture/furniture_uploads',
  express.static(path.join(__dirname, 'furniture_uploads'))
)





// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Data Base Connected'))
  .catch((err) => console.error('DB Connection Error:', err))





app.get('/furniture/test', (req, res) => res.send('Server is up for Furniture'))




// Routes
app.use('/furniture/api/users', userRoutes) // User routes
app.use('/furniture/api/products', productRoutes) // Product routes
app.use('/furniture/api/orders', orderRoutes) // Order routes
app.use('/furniture/api/reviews', reviewRoutes) // Review routes
app.use('/furniture/api/help', helpRoutes) // Help request routes
app.use('/furniture/api/testimonials', testimonialRoutes) // Testimonial routes
app.use('/furniture/api/blogs', blogRoutes) // Blog routes
app.use('/furniture/api/dashboard', dashboardRoutes) // Combination routes
app.use('/furniture/api/category', categoryRoutes) // Category and Subcategory routes
app.use('/furniture/api/cart', cartRoutes) // Category and Subcategory routes
app.use('/furniture/api/wishlist', wishlistRoutes) // Category and Subcategory routes
app.use('/furniture/api/address', addressRoutes) // Category and Subcategory routes
app.use('/furniture/api/banner', bannerRoutes) // Category and Subcategory routes
app.use('/furniture/api/contact', contactRoutes) // Category and Subcategory routes





// Server Setup
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
