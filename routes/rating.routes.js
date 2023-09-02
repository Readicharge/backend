const express = require('express');
const router = express.Router();

const {
  updateStage0Rating,
  updateStage1Rating,
  updateStage2Rating,
  calculateInstallerRating
} = require('../controllers/Rating/rating.controller'); // Replace 'your_controller_file' with the correct path to your controller file

// Define routes for each function
router.put('/update_stage_0_rating/:bookingId', updateStage0Rating);
router.put('/update_stage_1_rating/:bookingId', updateStage1Rating);
router.put('/update_stage_2_rating/:bookingId', updateStage2Rating);
router.put('/calculate_installer_rating/:bookingId', calculateInstallerRating);

module.exports = router;
