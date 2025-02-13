const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributorDealerController');

// Create a new distributor
router.post('/', distributorController.createDistributor);

// Get all distributors
router.get('/', distributorController.getAllDistributors);

// Get a distributor by ID
router.get('/:id', distributorController.getDistributorById);

// Update distributor by ID
router.put('/:id', distributorController.updateDistributor);

// Delete distributor by ID
router.delete('/:id', distributorController.deleteDistributor);

module.exports = router;
