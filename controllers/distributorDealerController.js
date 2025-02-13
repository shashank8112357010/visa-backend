const distributorDealerModel = require('../models/distributorDealerModel');

// Create a new distributor
exports.createDistributor = async (req, res) => {
  try {
    const newDistributor = new distributorDealerModel(req.body);
    await newDistributor.save();
    res.status(201).json({
      message: 'distributorDealerModel created successfully!',
      distributor: newDistributor,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating distributor.',
      error: error.message,
    });
  }
};

// Get all distributors
exports.getAllDistributors = async (req, res) => {
  try {
    const distributors = await distributorDealerModel.find();
    if (distributors.length === 0) {
      res.status(204).json({
        success: true,
        error: false,
        data: [],
      });
    }
    else {
      res.status(200).json({
        success: true,
        error: false,
        data: distributors,
      });
    }

  } catch (error) {
    res.status(400).json({
      message: 'Error fetching distributors.',
      error: error.message,
    });
  }
};

// Get a distributor by ID
exports.getDistributorById = async (req, res) => {
  try {
    const distributor = await distributorDealerModel.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({
        message: 'distributorDealerModel not found.',
      });
    }
    res.status(200).json({
      distributor: distributor,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching distributor.',
      error: error.message,
    });
  }
};

// Update distributor information
exports.updateDistributor = async (req, res) => {
  try {
    const updatedDistributor = await distributorDealerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDistributor) {
      return res.status(404).json({
        message: 'distributorDealerModel not found.',
      });
    }
    res.status(200).json({
      message: 'distributorDealerModel updated successfully!',
      distributor: updatedDistributor,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating distributor.',
      error: error.message,
    });
  }
};

// Delete a distributor
exports.deleteDistributor = async (req, res) => {
  try {
    const deletedDistributor = await distributorDealerModel.findByIdAndDelete(req.params.id);
    if (!deletedDistributor) {
      return res.status(404).json({
        message: 'distributorDealerModel not found.',
      });
    }
    res.status(200).json({
      message: 'distributorDealerModel deleted successfully!',
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting distributor.',
      error: error.message,
    });
  }
};
