const { Product, Category, Subcategory } = require('../models/productModel');
const path = require("path")
const fs = require("fs")
require("dotenv").config()

// Create a new category (Admin only)
const createCategory = async (req, res) => {
  const { name } = req.body;
  const image = req.file && req.file.mimetype.includes('image') 
  ? `${process.env.BACKEND_URL}/${req.file.path}` 
  : null; // Null if no valid image
  try {
    const newCategory = new Category({ name , image });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new subcategory (Admin only)
const createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;
  
  const image = req.file && req.file.mimetype.includes('image') 
  ? `${process.env.BACKEND_URL}/${req.file.path}` 
  : null; // Null if no valid image

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newSubcategory = new Subcategory({ name, category: categoryId , image });
    await newSubcategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory: newSubcategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategories = await Subcategory.find({ category: categoryId });
    const subcategoryIds = subcategories.map(sub => sub._id);

    const products = await Product.find({
      $or: [
        { category: categoryId },
        { subcategory: { $in: subcategoryIds } },
      ],
    });

    // Delete associated product images
    products.forEach(product => {
      product.images.forEach(imageUrl => {
        const filePath = imageUrl.replace(`${process.env.BACKEND_URL}/`, '');
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      });
    });

    await Subcategory.deleteMany({ category: categoryId });
    await Product.deleteMany({
      $or: [
        { category: categoryId },
        { subcategory: { $in: subcategoryIds } },
      ],
    });
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: 'Category, associated subcategories, products, and images deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};


const deleteSubcategory = async (req, res) => {
  const { subcategoryId } = req.params;

  try {
    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const products = await Product.find({ subcategory: subcategoryId });

    // Delete associated product images
    products.forEach(product => {
      product.images.forEach(imageUrl => {
        const filePath = imageUrl.replace(`${process.env.BACKEND_URL}/`, '');
        console.log(filePath , "filePath");
        const absolutePath = path.resolve(filePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      });
    });

    await Product.deleteMany({ subcategory: subcategoryId });
    await Subcategory.findByIdAndDelete(subcategoryId);

    res.status(200).json({
      message: 'Subcategory, associated products, and images deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};


const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Fetch all categories and populate their related subcategories
    const categories = await Category.find().lean(); // Use `lean()` for better performance

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        // Fetch subcategories for each category
        const subcategories = await Subcategory.find({ category: category._id });
        return {
          _id: category._id,
          name: category.name,
          image: category.image,
          subcategories: subcategories
        };
      })
    );

    res.status(200).json({ categories: categoryData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};


const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories and populate their related subcategories
    const categories = await Category.find({} , "_id name image").lean(); // Use `lean()` for better performance

    // const categoryData = await Promise.all(
    //   categories.map(async (category) => {
    //     // Fetch subcategories for each category
    //     const subcategories = await Subcategory.find({ category: category._id }, 'name');
    //     return {
    //       _id: category._id,
    //       name: category.name,
    //       subcategories: subcategories.map(sub => sub.name),
    //     };
    //   })
    // );

    res.status(200).json({ categories: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};



const getSubcategoryByCategoryId = async (req, res) => {
  try {
    const {categoryId} = req.params
    // Fetch all categories and populate their related subcategories
    const categories = await Subcategory.find( { category : categoryId }).lean(); // Use `lean()` for better performance

  

    res.status(200).json({  success : true , error : false , data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};


const getAllSubCategories = async (req, res) => {
  try {
    // Fetch all categories and populate their related subcategories
    const subcategories = await Subcategory.find().populate('category', 'name').lean(); // Use `lean()` for better performance

    res.status(200).json({ success : true , error :false , data: subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};





// Create a new product (Admin only) with image upload
const createProduct = async (req, res) => {
  const { title, price, rating, description, category, subcategory , serialnumber } = req.body;
  const images = req.files.filter(file => file.mimetype.includes('image')).map(file => `${process.env.BACKEND_URL}/${file.path}`); // Array of image paths
  try {
    // Validate category and subcategory
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Create the product
    const newProduct = new Product({
      title,
      price,
      rating,
      description,
      category,
      serialnumber,
      subcategory,
      images,
      createdBy: req.user.userId,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a product (Admin only) with image upload
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, rating, description, category, subcategory , serialnumber } = req.body;
  const images = req.files.filter(file => file.mimetype.includes('image')).map(file => `${process.env.BACKEND_URL}/${file.path}`); // Array of image paths

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.title = title || product.title;
    product.price = price || product.price;
    product.rating = rating || product.rating;
    product.description = description || product.description;
    product.serialnumber = serialnumber || product.serialnumber;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.images = images.length > 0 ? images : product.images; // Keep existing images if no new images are uploaded

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Extract image paths and delete them
    product.images.forEach(imageUrl => {
      const filePath = imageUrl.replace(`${process.env.BACKEND_URL}/`, ''); // Remove backend URL to get the relative path
      const absolutePath = path.resolve(filePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath); // Delete the file
      }
    });

    // Delete the product
    await product.deleteOne();

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Get all products for users
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('createdBy', 'name email');


    if (!products) {
      res.status(204).json({ success: true, message: "No Product Found", error: false, data: products });
    }
    res.status(200).json({ success: true, message: "Product Fetched Successfully", error: false, data: products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all products by category ID
const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params; // Extract categoryId from the route parameters

  try {
    // Fetch all subcategories under the given category
    const subcategories = await Subcategory.find({ category: categoryId }, '_id');

    // Extract subcategory IDs into an array
    const subcategoryIds = subcategories.map(sub => sub._id);

    // Fetch all products related to the category or its subcategories
    const products = await Product.find({
      $or: [
        { category: categoryId },
        { subcategory: { $in: subcategoryIds } },
      ],
    })
      .populate('category', 'name') // Populate category details
      .populate('subcategory', 'name') // Populate subcategory details
    
    if (!products.length) {
      return res.status(204).json({
        success: true,
        message: "No Product Found",
        error: false,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      error: false,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};












module.exports = {
  createCategory,
  createSubcategory,
  createProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  deleteCategory,
  deleteSubcategory,
  getAllCategoriesWithSubcategories,
  getAllSubCategories,
  getSubcategoryByCategoryId,
  getProductsByCategoryId,
  getAllCategories
};
