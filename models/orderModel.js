const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  paymentType: { type: String, default: "Online" },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  transactionId: { type: String }, // Optional for Razorpay
  orderStatus: { type: String, enum: ["Placed", "Processing", "Shipped", "Delivered"], default: "Placed" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
} ,  { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
