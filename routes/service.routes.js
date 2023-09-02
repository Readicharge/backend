// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createService,
  deleteService,
  updateService,
  getServiceById,
  getServices
} = require('../controllers/service.controller');
 // Create a new service
router.post('/', createService);
 // Delete a service by id
router.delete('/:id', deleteService);
 // Update a service by id
router.put('/:id', updateService);
 // Get a list of all services
router.get('/', getServices);
 // Get a specific service by id
router.get('/:id', getServiceById);

 module.exports = router;