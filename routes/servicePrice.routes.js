const express = require('express');
const router = express.Router();
const customerRatesController = require('../controllers/servicePrice.controller');
 router.post('/', customerRatesController.createCustomerRate);
router.get('/', customerRatesController.getAllCustomerRates);
router.get('/:id', customerRatesController.getCustomerRateById);
router.patch('/:id', customerRatesController.updateCustomerRate);
router.delete('/:id', customerRatesController.deleteCustomerRate);
router.get('/service/:serviceId', customerRatesController.getCustomerRatesByServiceId);
 module.exports = router;