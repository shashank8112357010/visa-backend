const Address = require("../models/addressModel");
require("dotenv").config()
// Create a new address
exports.createAddress = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const { address, city, landmark, state, zipCode, country } = req.body;

  try {
    const newAddress = await Address.create({
      user: userId,
      address,
      city,
      landmark,
      state,
      zipCode,
      country,
    });

    res.status(201).json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to create address" });
  }
};

// Get all addresses for the user
exports.getAddresses = async (req, res) => {
  const userId = req.user.userId;

  try {
    const addresses = await Address.find({ user: userId });
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
  const { addressId } = req.params;

  try {
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
};


// Update an existing address
exports.updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const updates = req.body; // Partial updates provided by the user
  
    try {
      // Fetch the existing address document
      const existingAddress = await Address.findById(addressId);
  
      if (!existingAddress) {
        return res.status(404).json({ error: "Address not found" });
      }
  
      // Merge updates with existing fields
      const updatedFields = {
        address: updates.address || existingAddress.address,
        city: updates.city || existingAddress.city,
        landmark: updates.landmark || existingAddress.landmark,
        state: updates.state || existingAddress.state,
        zipCode: updates.zipCode || existingAddress.zipCode,
        country: updates.country || existingAddress.country,
      };
  
      // Update the document with the merged data
      const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedFields, { new: true });
  
      res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
      res.status(500).json({ error: "Failed to update address" });
    }
  };
  

// Delete an address = > 
exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address" });
  }
};
