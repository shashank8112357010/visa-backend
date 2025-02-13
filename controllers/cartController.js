const Cart = require("../models/cartModel");
require("dotenv").config()

// Add a product to the cart or increase its quantity
exports.addToCart = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if product already exists in cart
      const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (productIndex > -1) {

        console.log(typeof (quantity), "quantity body")
        console.log(typeof (cart.items[productIndex].quantity), "quantity db")

        // Increase quantity if product exists
        cart.items[productIndex].quantity += Number(quantity);
      } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity });
      }
    } else {
      // Create a new cart
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};

exports.IncreaseDecreaseFromCart = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const { productId, quantity, type } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (productIndex > -1) {
      if (type === 'increase') {
        // Increase the quantity of the product
        cart.items[productIndex].quantity += Number(quantity);
      } else if (type === 'decrease') {
        // Decrease the quantity of the product
        if (cart.items[productIndex].quantity > Number(quantity)) {
          cart.items[productIndex].quantity -= Number(quantity);
        } else {
          // If quantity becomes 0 or less, remove the product
          cart.items.splice(productIndex, 1);
        }
      } else {
        return res.status(400).json({ error: "Invalid type. Use 'increase' or 'decrease'" });
      }

      await cart.save();
      res.status(200).json({ message: "Cart updated successfully" });
    } else {
      res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
};


// Delete a product from the cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
};

// Get cart details with product info
exports.getCart = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title description price images",
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
