const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema
} = require('../validation/validation')
const { sendMail } = require('../common/sendmail')

// Generate JWT Token
const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn
  })
}

// Register User
const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  const { name, email, phone, password } = req.body
  try {
    if (await User.findOne({ $or: [{ email }, { phone }] })) {
      return res
        .status(400)
        .json({ success: false, message: 'Email or Phone already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await new User({ name, email, phone, password: hashedPassword }).save()

    res
      .status(201)
      .json({ success: true, message: 'User registered successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Login User
const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        subscribe: user.subscribe
      }
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Forget Password
const forgetUser = async (req, res) => {
  const { error } = emailSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Email not registered' })

    const token = generateToken(user, '15m')
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`

    await sendMail(
      user.email,
      'Password Reset Request',
      `Click the link below to reset your password: ${resetUrl}`
    )
    res.json({
      success: true,
      message: 'Password reset link sent successfully'
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Reset Password
const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })

  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' })

    user.password = await bcrypt.hash(req.body.newPassword, 10)
    await user.save()

    res.json({ success: true, message: 'Password reset successfully' })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired token',
      error: err.message
    })
  }
}

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name phone email')
    res.json({ success: true, data: users.length ? users : 'No users found' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Toggle Subscription Status
const toggleSubscribe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Toggle the boolean value
    user.subscribe = !user.subscribe;
    await user.save();

    res.json({
      success: true,
      message: "Subscription status updated",
      subscribe: user.subscribe,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true
    }).select('name phone email')
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' })
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Change Password
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' })

    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect current password' })
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10)
    await user.save()
    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword,
  getUsers,
  changePassword,
  updateProfile,
  toggleSubscribe
}
