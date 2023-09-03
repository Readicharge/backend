
const express = require('express');
const router = express.Router();
const {createCustomer , updateCustomer }= require('../controllers/customer.controller');
 
// Create a new customer
router.post('/', createCustomer);
router.put("/:id",updateCustomer);






module.exports = router;
