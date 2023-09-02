const CustomerRates = require('../models/servicePrice.model');

// Creating the Customer Rates fo rthe Service id 
 const createCustomerRate = async (req, res) => {
  try {
    const { service_id, number_of_installs, price } = req.body;
    const customerRate = new CustomerRates({
      service_id,
      number_of_installs,
      price
    });
    await customerRate.save();
    res.status(201).json(customerRate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Getting all the rates 
 const getAllCustomerRates = async (req, res) => {
  try {
    const customerRates = await CustomerRates.find();
    res.json(customerRates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 const getCustomerRateById = async (req, res) => {
  try {
    const customerRate = await CustomerRates.findById(req.params.id);
    if (customerRate == null) {
      return res.status(404).json({ message: 'Cannot find customer rate' });
    }
    res.json(customerRate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 const updateCustomerRate = async (req, res) => {
  try {
    const customerRate = await CustomerRates.findById(req.params.id);
    if (customerRate == null) {
      return res.status(404).json({ message: 'Cannot find customer rate' });
    }
    if (req.body.service_id != null) {
      customerRate.service_id = req.body.service_id;
    }
    if (req.body.number_of_installs != null) {
      customerRate.number_of_installs = req.body.number_of_installs;
    }
    if (req.body.price != null) {
      customerRate.price = req.body.price;
    }
    const updatedCustomerRate = await customerRate.save();
    res.json(updatedCustomerRate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 const deleteCustomerRate = async (req, res) => {
  try {
    const customerRate = await CustomerRates.findByIdAndDelete(req.params.id);
 
    res.json({ message: 'Deleted customer rate' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting all the customer rates for the service Id 

const getCustomerRatesByServiceId = async (req, res) => {
    try {
      const serviceId = req.params.serviceId;
      const customerRates = await CustomerRates.find({ service_id: serviceId });
      res.json(customerRates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



 module.exports = {
  createCustomerRate,
  getAllCustomerRates,
  getCustomerRateById,
  updateCustomerRate,
  deleteCustomerRate,
  getCustomerRatesByServiceId
};