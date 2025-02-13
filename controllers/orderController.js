const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.status(201).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
      


    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success : false , error: "Payment verification failed" });
    }

    res.status(200).json({ success : true , message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Payment verification error" });
  }
};

// Place Order
exports.placeOrder = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const { products, order_id, totalAmount, address, transactionId } = req.body;

  try {
    // Create the order
    const order = await Order.create({
      _id: String(order_id),
      user: userId,
      products,
      totalAmount,
      address,
      transactionId: transactionId
    });

    // Send order confirmation email
    const emailText = `Thank you for placing your order. Your order ID is ${order._id}.`;
    await sendEmail(req.user.email, "Order Confirmation", emailText);

    res.status(201).json({ message: "Order placed successfully", order , success : true });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};





// User: Fetch orders
exports.getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await Order.find({ user: userId })
      .populate("products.product", "title price images")
      .populate("address");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Admin: Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .populate("address");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();
    await order.save();

    // Send email notification based on the status
    let emailText;
    switch (orderStatus) {
      case "Processing":
        emailText = `Your order ${order._id} is now being processed.`;
        break;
      case "Shipped":
        emailText = `Your order ${order._id} has been shipped.`;
        break;
      case "Delivered":
        emailText = `Your order ${order._id} has been delivered. Thank you for shopping with us!`;
        break;
      default:
        emailText = `Your order ${order._id} status has been updated.`;
    }

    const userEmail = order.user.email || req.user.email; // Assuming user email is in token or order relation
    await sendEmail(userEmail, "Order Status Update", emailText);

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
