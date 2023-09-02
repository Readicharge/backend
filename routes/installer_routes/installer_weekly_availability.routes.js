const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/Installer_availability/installer_weekly_availability.controller');


router.get("/getScheduleForInstaller/:installerId",scheduleController.getScheduleForInstaller);
router.post('/schedules', scheduleController.createOrUpdateSchedule);
router.get('/inactive-dates/:installerId', scheduleController.getInactiveDates);
 module.exports = router;