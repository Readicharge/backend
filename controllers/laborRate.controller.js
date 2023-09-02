const LabourRates = require("../models/laborRate.model")

 const getAllLabourRates = async (req, res) => {
  try {
    const labourRates = await LabourRates.find();
    res.status(200).json(labourRates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLabourRateById = async (req, res) => {
    try {
      const labourRate = await LabourRates.findById(req.params.id);
      if (labourRate == null) {
        return res.status(404).json({ message: 'Labour rate not found' });
      }
      res.status(200).json(labourRate);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  const createLabourRate = async (req, res) => {
    const labourRate = new LabourRates({
      service_id: req.body.service_id,
      number_of_installs: req.body.number_of_installs,
      price_statewise: req.body.price_statewise
    });
  
    try {
      const newLabourRate = await labourRate.save();
      res.status(201).json(newLabourRate);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };


  const updateLabourRateById = async (req, res) => {
    try {
      const labourRate = await LabourRates.findById(req.params.id);
      if (labourRate == null) {
        return res.status(404).json({ message: 'Labour rate not found' });
      }
      if (req.body.service_id != null) {
        labourRate.service_id = req.body.service_id;
      }
      if (req.body.number_of_installs != null) {
        labourRate.number_of_installs = req.body.number_of_installs;
      }
      if (req.body.price_statewise != null) {
        labourRate.price_statewise = req.body.price_statewise;
      }
      const updatedLabourRate = await labourRate.save();
      res.status(200).json(updatedLabourRate);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteLabourRateById = async (req, res) => {
    try {
      const labourRate = await LabourRates.findByIdAndDelete(req.params.id);
      if (labourRate == null) {
        return res.status(404).json({ message: 'Labour rate not found' });
      }
    
      res.status(200).json({ message: 'Labour rate deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



  const geLabourRateByServiceId = async(req,res) =>{
    try {
      const serviceId = req.params.serviceId;
      const labourRates = await LabourRates.find({ service_id: serviceId });
      res.json(labourRates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }




 module.exports = { getAllLabourRates , getLabourRateById , createLabourRate , updateLabourRateById ,deleteLabourRateById,geLabourRateByServiceId};