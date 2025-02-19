const Cart = require('../models/Cart')
require('dotenv').config()
const Redis = require('ioredis')
const redis = new Redis()

// Add a product to the cart or increase its quantity
exports.addToCart = async (req, res) => {
  const userId = req.user.id // Extract userId from token

  const { productId, quantity, size } = req.body

  try {
    let cart = await Cart.findOne({ user: userId })

    if (cart) {
      console.log('cart exist')
      // Check if product already exists in cart
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      )
      if (productIndex > -1) {
        console.log('inside increase quantity', productIndex)
        // Increase quantity if product exists
        cart.items[productIndex].quantity += Number(quantity)
      } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity, size })
      }
    } else {
      console.log('inside creation cart')
      // Create a new cart
      cart = await new Cart({
        user: userId,
        items: [{ product: productId, quantity, size }]
      })
    }

    await cart.save()

    res.status(200).json({ message: 'Product added to cart successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' })
  }
}

exports.IncreaseDecreaseFromCart = async (req, res) => {
  const userId = req.user.id // Extract userId from token
  console.log('hey')
  const { productId, quantity, type } = req.body
  console.log(type, 'type')

  try {
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (productIndex > -1) {
      if (type === 'increase') {
        // Increase the quantity of the product
        cart.items[productIndex].quantity += Number(quantity)
      } else if (type === 'decrease') {
        console.log('inside')
        // Decrease the quantity of the product
        if (cart.items[productIndex].quantity > Number(quantity)) {
          cart.items[productIndex].quantity -= 1
        } else {
          // If quantity becomes 0 or less, remove the product
          cart.items.splice(productIndex, 1)
        }
      } else {
        return res
          .status(400)
          .json({ error: "Invalid type. Use 'increase' or 'decrease'" })
      }

      await cart.save()
      res.status(200).json({ message: 'Cart updated successfully' })
    } else {
      res.status(404).json({ error: 'Product not found in cart' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' })
  }
}

// Delete a product from the cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id // Extract userId from token
  const { productId } = req.params

  try {
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )

    await cart.save()
    res.status(200).json({ message: 'Product removed from cart successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from cart' })
  }
}

// Get cart details with product info
exports.getCart = async (req, res) => {
  const userId = req.user.id // Extract userId from token

  try {
    const cachedCart = await redis.get(`cart:${userId}`)
    if (cachedCart)
      return res.json({ success: true, cart: JSON.parse(cachedCart) })

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name description price images'
    })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    if (cart) redis.set(`cart:${userId}`, JSON.stringify(cart), 'EX', 300) // Cache for 5 mins

    res.status(200).json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}
