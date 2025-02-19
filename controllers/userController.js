const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registerSchema, loginSchema } = require('../validation/validation')

const { emailSchema, resetPasswordSchema } = require('../validation/validation')
const { sendMail } = require('../common/sendmail')

const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  const { name, email, phone, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: 'Email already exists' })
    }

    const existingUserPhone = await User.findOne({ phone })
    if (existingUserPhone) {
      return res
        .status(400)
        .send({ success: false, message: 'Phone already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, phone, password: hashedPassword })
    await newUser.save()

    res
      .status(201)
      .send({ success: true, message: 'User registered successfully' })
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: 'Server error', error: err.message })
  }
}

const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res
        .status(400)
        .send({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.send({
      success: true,
      token,
      user: { name: user.name, email: user.email , phone  : user.phone , subscribe : user.subscribe }
    })
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: 'Server error', error: err.message })
  }
}

// Forget Password: Send Reset URL with Token
const forgetUser = async (req, res) => {
  const { error } = emailSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  const { email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Email not registered' })

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    })
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`

    // Send reset email
    const subject = 'Password Reset Request'
    const message = `You requested a password reset. Click the link below to reset your password: ${resetUrl}`
    await sendMail(email, subject, message)

    res
      .status(200)
      .send({ success: true, message: 'Password reset link sent successfully' })
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: 'Server error', error: err.message })
  }
}

const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message })

  const { token, newPassword } = req.body

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Invalid or expired token' })

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    res
      .status(200)
      .send({ success: true, message: 'Password reset successfully' })
  } catch (err) {
    res.status(400).send({
      success: false,
      message: 'Invalid or expired token',
      error: err.message
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name phone email')

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'No users found'
      })
    }

    res.json({
      success: true,
      data: users
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}

// Toggle subscribe status
const toggleSubscribe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    console.log('reaching', user)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.subscribe = !user.subscribe
    await user.save()

    res.json({
      success: true,
      message: `Subscription status updated to ${user.subscribe}`,
      subscribe: user.subscribe
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Update user profile (name, phone, email)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.name = name || user.name
    user.phone = phone || user.phone
    user.email = email || user.email

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { name: user.name, phone: user.phone, email: user.email }
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
}

// Change user password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect current password' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
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
