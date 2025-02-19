const Blog = require('../models/Blog')
const { blogSchema } = require('../validation/validation')
const redis = require('../common/redis') // Import Redis from common

const BLOG_CACHE_KEY = 'blogs' // Cache key for blogs

// Create a new blog
exports.createBlog = async (req, res) => {
  const { error } = blogSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const blogData = {
      ...req.body,
      image: `${process.env.BACKEND_URL}/furniture_uploads/${req.file.filename}`
    }

    const blog = new Blog(blogData)
    await blog.save()

    // Clear cached blogs
    await redis.del(BLOG_CACHE_KEY)

    res.status(201).json({ success: true, message: 'Blog added successfully', blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all blogs (with caching)
exports.getAllBlogs = async (req, res) => {
  try {
    const cachedBlogs = await redis.get(BLOG_CACHE_KEY)
    if (cachedBlogs) {
      return res.json({ success: true, data: JSON.parse(cachedBlogs) })
    }

    const blogs = await Blog.find({})
    if (!blogs || blogs.length === 0) {
      return res.status(204).json({ success: true, message: 'No blogs found', data: [] })
    }

    await redis.set(BLOG_CACHE_KEY, JSON.stringify(blogs), 'EX', 86400) // Cache for 24 hours

    res.status(200).json({ success: true, message: 'Blogs fetched successfully', data: blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    res.status(200).json({ success: true, message: 'Blog fetched successfully', data: blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete a blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }

    // Clear cached blogs
    await redis.del(BLOG_CACHE_KEY)

    res.status(200).json({ success: true, message: 'Blog deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
