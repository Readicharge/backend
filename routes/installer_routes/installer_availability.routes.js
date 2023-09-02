const express = require('express');
const router = express.Router();
const 
availabilityController = require('../../controllers/Installer_availability/installer_availability.controller');

// Update availability
router.put('/:installerId', availabilityController.updateAvailability);

// Get availability by installer ID
router.get('/:installerId', availabilityController.getAvailabilityByInstallerId);


 module.exports = router;