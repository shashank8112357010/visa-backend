const Wishlist = require('../models/Wishlist')
require('dotenv').config()
// Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id // Extract userId from token
  const { productId } = req.body

  try {
    let wishlist = await Wishlist.findOne({ user: userId })

    if (wishlist) {
      // Check if product already exists in the wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ error: 'Product already in wishlist' })
      }

      wishlist.products.push(productId)
    } else {
      // Create a new wishlist
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId]
      })
    }

    await wishlist.save()
    res.status(200).json({ message: 'Product added to wishlist successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to wishlist' })
  }
}

// Remove a product from the wishlist
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id // Extract userId from token
  const { productId } = req.params

  try {
    const wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' })
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    )

    await wishlist.save()
    res
      .status(200)
      .json({ message: 'Product removed from wishlist successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from wishlist' })
  }
}

// Get wishlist for the user
exports.getWishlist = async (req, res) => {
  const userId = req.user.id // Extract userId from token

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      select: 'name description price images' // Customize fields as needed
    })

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' })
    }

    res.status(200).json({ wishlist })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
}
