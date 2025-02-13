const Joi = require('joi')

const productSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.'
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'Product description is required.',
    'any.required': 'Product description is required.'
  }),
  ratings: Joi.number().min(0).max(5).required().messages({
    'number.min': 'Ratings must be at least 0.',
    'number.max': 'Ratings must not exceed 5.',
    'any.required': 'Ratings are required.'
  }),
  price: Joi.number().positive().required().messages({
    'number.positive': 'Price must be a positive number.',
    'any.required': 'Price is required.'
  }),
  colors: Joi.array().items(Joi.string().trim()).unique().required().messages({
    'array.unique': 'Colors must not contain duplicate values.',
    'array.includesRequiredUnknowns':
      'Colors cannot contain empty or undefined values.',
    'any.required': 'Colors are required.'
  }),
  sizes: Joi.array().items(Joi.string().trim()).unique().required().messages({
    'array.unique': 'Sizes must not contain duplicate values.',
    'array.includesRequiredUnknowns':
      'Sizes cannot contain empty or undefined values.',
    'any.required': 'Sizes are required.'
  }),
  fabric: Joi.string().trim().required().messages({
    'string.empty': 'Fabric is required.',
    'any.required': 'Fabric is required.'
  }),
  discount: Joi.number().required().messages({
    'string.empty': 'Discount is required.',
    'any.required': 'Discount is required.'
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Category must be a valid MongoDB ObjectId.',
      'any.required': 'Category is required.'
    }),
  subcategory: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Subcategory must be a valid MongoDB ObjectId.',
      'any.required': 'Subcategory is required.'
    })
})

// Joi validation schema
const influencerSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'string.empty': 'Name is required.' }),
  instagramHandle: Joi.string()
    .required()
    .messages({ 'string.empty': 'Instagram handle is required.' })
})

const reviewSchema = Joi.object({
  product: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  message: Joi.string().required(),
  image: Joi.string().optional().allow('') // Make image optional
})

const helpRequestSchema = Joi.object({
  orderId: Joi.string().required(),
  issue: Joi.string().required()
})

const styleSchema = Joi.object({
  name: Joi.string().required()
})

const testimonialSchema = Joi.object({
  name: Joi.string().required(),
  message: Joi.string().required()
})

const blogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required()
})

const combinationSchema = Joi.object({
  baseProduct: Joi.string().required(),
  relatedProducts: Joi.array().items(Joi.string()).required(),
  combinationPrice: Joi.number().required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  password: Joi.string().min(6).required()
})

// Joi validation schema for order creation
const orderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({ 'string.pattern.base': 'Invalid product ID.' }),
        size: Joi.string()

          .required()
          .messages({ 'string.empty': 'Size is required.' }),
        color: Joi.string()

          .required()
          .messages({ 'string.empty': 'color is required.' }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number.',
          'number.min': 'Quantity must be at least 1.'
        })
      })
    )
    .required()
    .messages({
      'array.base': 'Products must be an array.',
      'array.empty': 'Products cannot be empty.'
    }),
  address: Joi.object({
    street: Joi.string()
      .required()
      .messages({ 'string.empty': 'Street is required.' }),
    city: Joi.string()
      .required()
      .messages({ 'string.empty': 'City is required.' }),
    zipCode: Joi.string()
      .required()
      .messages({ 'string.empty': 'Zip Code is required.' }),
    country: Joi.string()
      .required()
      .messages({ 'string.empty': 'Country is required.' })
  })
    .required()
    .messages({ 'object.base': 'Address is required.' }),
  paymentMethod: Joi.string().valid('COD', 'Online').required().messages({
    'string.empty': 'Payment method is required.',
    'any.only': 'Payment method must be either "COD" or "Online".'
  }),
  currency: Joi.string()
    .required()
    .messages({ 'string.empty': 'Currency is required.' })
})

const emailSchema = Joi.object({
  email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
})

const addressValidationSchema = Joi.object({
  address: Joi.string().required().messages({
    'any.required': 'Address is required.',
    'string.empty': 'Address cannot be empty.'
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required.',
    'string.empty': 'City cannot be empty.'
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required.',
    'string.empty': 'Country cannot be empty.'
  }),
  state: Joi.string().required().messages({
    'any.required': 'State is required.',
    'string.empty': 'State cannot be empty.'
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits.',
      'any.required': 'Phone number is required.',
      'string.empty': 'Phone number cannot be empty.'
    }),
  landmark: Joi.string().required().messages({
    'any.required': 'Landmark is required.',
    'string.empty': 'Landmark cannot be empty.'
  }),
  zipcode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Zipcode must be exactly 6 digits.',
      'any.required': 'Zipcode is required.',
      'string.empty': 'Zipcode cannot be empty.'
    })
})

module.exports = {
  addressValidationSchema,
  emailSchema,
  resetPasswordSchema,
  productSchema,
  loginSchema,
  registerSchema,
  influencerSchema,
  reviewSchema,
  helpRequestSchema,
  styleSchema,
  testimonialSchema,
  blogSchema,
  combinationSchema,
  orderSchema
}
