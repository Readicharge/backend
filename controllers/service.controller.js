// controllers/serviceController.js
const Service = require('../models/service.model');

// Create a new service
const createService = async (req, res) => {
  try {
    const { name, description,service_code, yearsOfExperience,notes } = req.body;
    console.log(req.body)
    const newService = new Service({
      name,
      description,
      service_code,
      notes,
      yearsOfExperience
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 // Delete a service by id
const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Update a service by id
const updateService = async (req, res) => {
  try {
    const { name, description,  certification, yearsOfExperience, notes } = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, {
      name,
      description,
      certification,
      notes,
      yearsOfExperience
    }, { new: true });
    res.status(200).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 // Get a list of all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 // Get a specific service by id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.status(200).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 module.exports = {createService,deleteService,updateService,getServiceById,getServices};