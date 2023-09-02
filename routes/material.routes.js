const express = require('express');
const router = express.Router();
const {createMaterial,deleteMaterial,updateMaterial,getAllMaterials,getMaterialById} = require('../controllers/material.controller');
 // Create a new material
router.post('/', createMaterial);
 // Delete a material
router.delete('/:id', deleteMaterial);
 // Update a material
router.patch('/:id', updateMaterial);
 // Get all materials
router.get('/', getAllMaterials);
 // Get a specific material
router.get('/:id', getMaterialById);
 module.exports = router;


//  All are verified 