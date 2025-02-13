const mongoose = require("mongoose");

// Category Schema (reference model)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true }, 
}, { timestamps: true });



const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true }, 
}, { timestamps: true });


// Product Schema with references
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    serialnumber: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    images: { type: [String], required: true }, // Array of image URLs
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the product
  },
  { timestamps: true }
);



module.exports = {
  Product: mongoose.model("Product", productSchema),
  Category: mongoose.model("Category", categorySchema),
  Subcategory: mongoose.model("Subcategory", subcategorySchema),
};
