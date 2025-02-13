const Blog = require('../models/Blog')

exports.createBlog = async (req, res) => {
  // Validate the data (excluding the image file)
  try {
    const image = req.file && req.file.mimetype.includes('image') 
    ? `${process.env.BACKEND_URL}/${req.file.path}` 
    : null; // Null if no valid image
    // Create a blog with the uploaded image path
    const blogData = {
      ...req.body,
      image: image // Store the image path in the database
    }

    const blog = new Blog(blogData)
    await blog.save()
    res
      .status(201)
      .json({ success: true, message: 'Blog added successfully', blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()

    if (!blogs) {
      res
        .status(204)
        .json({ success: true, message: 'Blog Not Found', data: [] })
    }

    res.status(200).json({
      success: true,
      message: 'Blog fetched successfully',
      data: blogs
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete Blog Controller
exports.deleteBlog = async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'Blog deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get Individual Blog Controller
exports.getBlogById = async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findById(id) // Find blog by ID
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    res.status(200).json({
      success: true,
      message: 'Blog fetched successfully',
      data: blog
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
