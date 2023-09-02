const express = require('express');
const router = express.Router();
 const {  getAllLabourRates , getLabourRateById , createLabourRate , updateLabourRateById ,deleteLabourRateById ,geLabourRateByServiceId} = require('../controllers/laborRate.controller');
 // GET all labour rates
router.get('/', getAllLabourRates);
 // GET labour rate by ID
router.get('/:id', getLabourRateById);
 // POST create a new labour rate
router.post('/', createLabourRate);
 // PUT update a labour rate by ID
router.put('/:id', updateLabourRateById);
 // DELETE delete a labour rate by ID
router.delete('/:id', deleteLabourRateById);
// Get the Labour Rate by it's Service Id
router.get("/service/:id",geLabourRateByServiceId);
 module.exports = router;