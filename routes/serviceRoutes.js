const express = require('express');
const { createServiceRequest, getServiceById, updateServiceById, getAllServices, updateServiceStatus, deleteService } = require('../controllers/serviceController');
const { verifyAccessToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a service request
router.post('/', createServiceRequest);

// Get service details by ID
router.get('/:id', getServiceById);

// Update service (e.g., issue or address)
router.patch('/:id',  updateServiceById);

// Get all service requests
router.get('/', verifyAccessToken , isAdmin , getAllServices);

// Update service status
router.patch('/:id/:status',  verifyAccessToken , isAdmin , updateServiceStatus);

// Delete a service
router.delete('/:id', verifyAccessToken , isAdmin ,  deleteService);

module.exports = router;



