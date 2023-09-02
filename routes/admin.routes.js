const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminValidator = require("../validators/admin.validator");


const router = express.Router();

// CRUD routes
router.post('/', adminController.createAdmin);
router.get("/",adminController.getAdmin)
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdminById);
router.delete('/:id', adminController.deleteAdminById);


// Validator routes 
router.post('/validate', adminValidator.validateAdmin);




module.exports = router;
