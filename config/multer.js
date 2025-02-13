const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage Configuration
let storage = multer.diskStorage({
  destination: './furniture_uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// File Filter for Image and GIF Validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'));
  }
};

// Multer Export
module.exports = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size to 5MB
});
