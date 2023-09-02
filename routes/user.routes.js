
const express = require('express');
const router = express.Router();
const {createCustomer}= require('../controllers/customer.controller');
 
// Create a new customer
router.post('/', createCustomer);







module.exports = router;