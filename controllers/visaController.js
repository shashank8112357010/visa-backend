const VisaApplication = require('../models/VisaApplication.js')
const Razorpay = require('razorpay')
require('dotenv').config()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

module.exports.createVisaApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      currentAddress,
      city,
      state,
      zipcode,
      email,
      countryCode,
      mobileNumber,
      dateOfBirth,
      passportNumber,
      passportExpiry,
      visaType,
      arrivalDate,
      comments,
      amount // Amount required for visa processing
    } = req.body


    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

    const passportCopy = req.files?.passportCopy
      ? `${BACKEND_URL}/visa_uploads/${req.files.passportCopy[0].filename}`
      : 'N/A'

    const photograph = req.files?.photograph
      ? `${BACKEND_URL}/visa_uploads/${req.files.photograph[0].filename}`
      : 'N/A'

    // Save application with payment pending
    const newVisaApplication = await new VisaApplication({
      firstName,
      lastName,
      currentAddress,
      city,
      state,
      zipcode,
      email,
      countryCode,
      mobileNumber,
      dateOfBirth,
      passportNumber,
      passportExpiry,
      visaType,
      arrivalDate,
      passportCopy,
      photograph,
      comments,
      amount,
      paymentStatus: 'pending_payment'
    })

    await newVisaApplication.save()

    // // Create Razorpay Order
    // const order = await razorpay.orders.create({
    //   amount: amount * 100, // Convert amount to paise
    //   currency: 'INR',
    //   receipt: `visa_${newVisaApplication._id}`
    // })

    // Save order ID in DB
    newVisaApplication.razorpayOrderId = "order.id"
    await newVisaApplication.save()

    res.status(201).json({
      message:
        'Visa application submitted successfully. Please complete payment.',
      orderId: "order.id",
      visaApplication: newVisaApplication
    })
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ error: 'Server error while creating visa application' })
  }
}

module.exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body

    if (event === 'payment.captured') {
      const { order_id, payment_id } = payload.entity

      // Find visa application by Razorpay order ID
      const visaApplication = await VisaApplication.findOne({
        razorpayOrderId: order_id
      })

      if (visaApplication) {
        visaApplication.paymentStatus = 'paid'
        visaApplication.razorpayPaymentId = payment_id
        await visaApplication.save()

        console.log(
          `Payment successful for Visa Application ID: ${visaApplication._id}`
        )
      }
    }

    res.status(200).json({ message: 'Webhook received successfully' })
  } catch (error) {
    console.error('Webhook Error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

module.exports.verifyPayment = async (req, res) => {
  try {
    const { visaApplicationId, razorpayPaymentId } = req.body

    const visaApplication = await VisaApplication.findById(visaApplicationId)
    if (!visaApplication)
      return res.status(404).json({ error: 'Visa application not found' })

    visaApplication.paymentStatus = 'paid'
    visaApplication.razorpayPaymentId = razorpayPaymentId
    await visaApplication.save()

    res.status(200).json({ message: 'Payment verified successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error verifying payment' })
  }
}

// ✅ 1️⃣ Get all visa applications (Admin)
module.exports.getAllVisaApplications = async (req, res) => {
  try {
    const applications = await VisaApplication.find()
    res.status(200).json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    res
      .status(500)
      .json({ error: 'Server error while fetching visa applications' })
  }
}

// ✅ 2️⃣ Update visa application status (Admin)
module.exports.updateVisaApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body // New status from admin
    console.log("hey");

    const visaApplication = await VisaApplication.findById(id)
    if (!visaApplication) {
      return res.status(404).json({ error: 'Visa application not found' })
    }

    visaApplication.paymentStatus = status // Update status
    await visaApplication.save()

    res.status(200).json({
      message: 'Visa application status updated successfully',
      application: visaApplication
    })
  } catch (error) {
    console.error('Error updating visa application status:', error)
    res.status(500).json({ error: 'Server error while updating status' })
  }
}

// ✅ 3️⃣ Track visa application by mobile number (User)
module.exports.trackVisaApplication = async (req, res) => {
  try {
    const { mobileNumber } = req.params

    const application = await VisaApplication.findOne({ mobileNumber })
    if (!application) {
      return res
        .status(404)
        .json({ error: 'No application found for this mobile number' })
    }

    res.status(200).json({
      message: 'Visa application found',
      status: application.paymentStatus,
      application
    })
  } catch (error) {
    console.error('Error tracking visa application:', error)
    res.status(500).json({ error: 'Server error while tracking application' })
  }
}
