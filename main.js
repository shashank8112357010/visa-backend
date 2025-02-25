const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const cors = require('cors')

// Route imports
const userRoutes = require('./routes/userRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes')
const blogRoutes = require('./routes/blogRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const bannerRoutes = require('./routes/bannerRoutes.js')
const contactRoutes = require('./routes/contactRoutes.js')

const app = express()
app.use(cors({}))

app.use(bodyParser.json())
app.use(
  '/visa/visa_uploads',
  express.static(path.join(__dirname, 'visa_uploads'))
)

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Data Base Connected'))
  .catch((err) => console.error('DB Connection Error:', err))

app.get('/visa/test', (req, res) =>
  res.send('Server is up for visa application')
)

// Routes
app.use('/visa/api/users', userRoutes) // User routes
app.use('/visa/api/testimonials', testimonialRoutes) // Testimonial routes
app.use('/visa/api/blogs', blogRoutes) // Blog routes
app.use('/visa/api/dashboard', dashboardRoutes) // Combination routes
app.use('/visa/api/banner', bannerRoutes) // Category and Subcategory routes
app.use('/visa/api/contact', contactRoutes) // Category and Subcategory routes

// Server Setup
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port... ${PORT}`))
