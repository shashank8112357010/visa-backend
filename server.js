const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const helpRoutes = require("./routes/helpRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const distributorDealerRoutes = require("./routes/distributorDealerRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");



const cors = require("cors")


const path = require("path")
dotenv.config();
const app = express();

// Middleware
app.use(cors())

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use('/furniture/api/furniture_uploads', express.static(path.join(__dirname, 'furniture_uploads')))

// Connect to MongoDB
connectDB();


// Routes
app.use("/furniture/api/auth", authRoutes);
app.use("/furniture/api/category", categoryRoutes);
app.use("/furniture/api/product", productRoutes);
app.use("/furniture/api/cart", cartRoutes);
app.use("/furniture/api/wishlist", wishlistRoutes);
app.use("/furniture/api/address", addressRoutes);
app.use("/furniture/api/order", orderRoutes);
app.use("/furniture/api/help", helpRoutes);
app.use("/furniture/api/dashboard", dashboardRoutes);
app.use("/furniture/api/service", serviceRoutes);
app.use("/furniture/api/distributordealer", distributorDealerRoutes );
app.use("/furniture/api/banner", bannerRoutes );
app.use("/furniture/api/blogs", blogRoutes );
app.use("/furniture/api/testimonials", testimonialRoutes );







app.get('/furniture/test' , (req,res)=>res.send("Furniture backend is up and running...."))



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
