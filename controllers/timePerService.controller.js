const Time = require('../models/timePerService.model');
const Installer = require('../models/installer.model');
 exports.createTime = async (req, res) => {
  try {
    const time = new Time(req.body);
    await time.save();
    res.status(201).json(time);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
 exports.getAllTimes = async (req, res) => {
  try {
    const times = await Time.find();
    res.status(200).json(times);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getTimeperInstaller = async (req, res) => {
  try {
    const installerId = req.params.installerId;
    
    const installer = await Installer.findById(installerId);
    if (!installer) {
      return res.status(404).json({ message: 'Installer not found' });
    }
    
    const serviceIds = installer.services; // Assuming installer.services is an array of service IDs
    
    if (serviceIds.length === 0) {
      return res.status(400).json({ message: 'Installer has no services' });
    }
    console.log(serviceIds);
    const timePerServices = await Time.find({ service_id: { $in: serviceIds } , number_of_installs : 1});
    if (timePerServices.length === 0) {
      return res.status(404).json({ message: 'Time not found for any services' });
    }
    console.log(timePerServices);
   const minTimeService = timePerServices.reduce((minTimeService, currentService) => {
  return currentService.time_max < minTimeService.time_max ? currentService : minTimeService;
}, timePerServices[0]);
    
   res.status(200).json({time:minTimeService.time_max});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

 exports.getTimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const time = await Time.findById(id);
    if (!time) {
      return res.status(404).json({ message: 'Time not found' });
    }
    res.status(200).json(time);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
 exports.updateTime = async (req, res) => {
  try {
    const { id } = req.params;
    const time = await Time.findByIdAndUpdate(id, req.body, { new: true });
    if (!time) {
      return res.status(404).json({ message: 'Time not found' });
    }
    res.status(200).json(time);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
 exports.deleteTime = async (req, res) => {
  try {
    const { id } = req.params;
    const time = await Time.findByIdAndDelete(id);
    if (!time) {
      return res.status(404).json({ message: 'Time not found' });
    }
    res.status(200).json({ message: 'Time deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
