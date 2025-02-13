const Order = require('../models/Order')
const Product = require('../models/Product')
const { sendMail } = require('../common/sendmail')
const { orderSchema } = require('../validation/validation')

const User = require('../models/User')

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { error } = orderSchema.validate(req.body)
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message })
    }

    const { products, address, paymentMethod, currency } = req.body

    // Extract product IDs from the order
    const productIds = products.map((p) => p.productId)

    // Fetch products from the database to validate their existence and stock
    const foundProducts = await Product.find({ _id: { $in: productIds } })

    if (foundProducts.length !== products.length) {
      return res.status(400).json({
        success: false,
        message: 'Some products are invalid or unavailable.'
      })
    }

    // Check stock availability for each product
    const insufficientStock = products.some((p) => {
      const product = foundProducts.find(
        (fp) => fp._id.toString() === p.productId
      )
      return product.stock < p.quantity // Validate stock availability
    })

    if (insufficientStock) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for one or more products.'
      })
    }

    // Create the order
    const order = new Order({
      userId: req.user.id,
      products,
      address,
      paymentMethod,
      currency
    })

    // Update product salesCount and stock
    await Promise.all(
      products.map(async (p) => {
        await Product.findByIdAndUpdate(p.productId, {
          $inc: { salesCount: p.quantity, stock: -p.quantity } // Decrement stock and increment sales count
        })
      })
    )

    // Save the order
    await order.save()

    // Optionally send an order confirmation email
    await sendMail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Thank you for your purchase! Your order (ID: ${order._id}) has been successfully placed.`
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'products', // Collection name for products
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$products',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: {
          path: '$productInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          'products.name': '$productInfo.name' // Add product name directly to the product array
        }
      },
      {
        $group: {
          _id: '$_id',
          orderId: { $first: '$_id' },
          products: {
            $push: {
              productId: '$products.productId',
              quantity: '$products.quantity',
              name: '$products.name',
              size: '$products.size',
              color: '$products.color'
            }
          },
          address: { $first: '$address' },
          paymentMethod: { $first: '$paymentMethod' },
          currency: { $first: '$currency' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' }
        }
      },
      {
        $project: {
          orderId: 1,
          products: 1,
          address: 1,
          paymentMethod: 1,
          currency: 1,
          status: 1,
          createdAt: 1
        }
      }
    ])

    if (!orders || orders.length === 0) {
      return res
        .status(204)
        .json({ success: true, message: 'No Orders Found.' })
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully.',
      data: orders
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user ID.' })
    }

    const orders = await Order.find({ userId }).populate(
      'products.productId',
      'name price'
    )

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No orders found for this user.' })
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully.',
      orders
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// Mark an order as delivered
exports.markOrderAsDelivered = async (req, res) => {
  const { orderId } = req.params

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found.' })
    }

    // Check if the order is already delivered
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order is already marked as delivered.'
      })
    }

    // Update the status to 'delivered'
    order.status = 'delivered'
    await order.save()

    // Get the user's email to notify them
    const user = await User.findById(order.userId)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' })
    }

    // Send an email notification to the user
    const subject = 'Your Order has been Delivered'
    const message =
      'Your order has been successfully delivered. Thank you for shopping with us!'
    await sendMail(user.email, subject, message)

    res.status(200).json({
      success: true,
      message: 'Order marked as delivered and user notified via email.',
      order
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// Delete an order (if placed wrong)
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found.' })
    }

    // Ensure the order belongs to the current user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this order.'
      })
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId)

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully.'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
