const Service = require('../models/serviceModel');
const {Product} = require('../models/productModel');


// Client: Create a service request
exports.createServiceRequest = async (req, res) => {
    try {
      const { productSerialNumber } = req.body;
  
      // Check if the productSerialNumber exists in the Product schema
      const productExists = await Product.findOne({ serialnumber: productSerialNumber });
      if (!productExists) {
        return res.status(404).json({ message: 'Invalid product serial number. Product not found.' });
      }
  
      // Create and save the service request
      const service = new Service(req.body);
      await service.save();
  
      res.status(201).json({ message: 'Service request created successfully', service });
    } catch (error) {
      res.status(400).json({ message: 'Error creating service request', error: error.message });
    }
  };

// Client: Get service details by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching service', error: error.message });
  }
};

// Client: Update service (e.g., issue or address)
exports.updateServiceById = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

// Admin: Get all service requests
exports.getAllServices = async (req, res) => {
    try {
      // Fetch all service requests
      const services = await Service.find();
  
      // If no services found, return a 204 (No Content) status
      if (services.length === 0) {
        return res.status(204).json({
          status: 'error',
          message: 'No services found',
          data: []
        });
      }
  
      // If services are found, return a 200 (OK) status with the data
      res.status(200).json({
        status: 'success',
        message: 'Services fetched successfully',
        data: services
      });
    } catch (error) {
      // If there's an error, return a 400 (Bad Request) status with the error message
      res.status(400).json({
        status: 'error',
        message: 'Error fetching services',
        error: error.message
      });
    }
  };
  

// Admin: Update service status
exports.updateServiceStatus = async (req, res) => {
  try {
    const { status  , id } = req.params;
    console.log(status , "status");
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.status = status;
    await service.save(); // Trigger the `pre('save')` middleware
    res.status(200).json({ message: 'Service status updated successfully', service });
  } catch (error) {
    res.status(400).json({ message: 'Error updating service status', error: error.message });
  }
};

// Admin: Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting service', error: error.message });
  }
};
