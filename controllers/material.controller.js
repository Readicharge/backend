const Materials = require('../models/material.model');
 // Create a new material
const createMaterial = async (req, res) => {
  try {
    const material = new Materials(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 // Delete a material
const deleteMaterial = async (req, res) => {
  try {
    const material = await Materials.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 // Update a material
const updateMaterial = async (req, res) => {
  try {
    const material = await Materials.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 // Get all materials
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Materials.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 // Get a specific material
const  getMaterialById = async (req, res) => {
  try {
    const material = await Materials.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createMaterial,deleteMaterial,updateMaterial,getAllMaterials,getMaterialById};