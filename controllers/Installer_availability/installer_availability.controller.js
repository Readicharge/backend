const Availability = require('../../models/installer_availability/installer_availability.model');
const Service = require("../../models/service.model")
const Installer = require("../../models/installer.model")


const { getTimeForService } = require('../../utils/Availability_helper.utils');

exports.updateAvailability = async (req, res) => {
  try {
    const { date, time_start, time_end,type } = req.body;
    const installerId = req.params.installerId;
    const availability = await Availability.findOne({ installer_id: installerId, date: date });

    if (availability) {
      if (availability.time_start === time_start && availability.time_end === time_end) {
        // Delete the availability if the time slots match
        // await Availability.findByIdAndDelete(availability._id);
        if(availability.type !== type) 
        {
           availability.type = type;
        await availability.save();
            return res.json(availability);
        }
        else
        {
       return res.json(availability);
        }
      } else {
        // Update the availability if the time slots are different
        availability.time_start = time_start;
        availability.time_end = time_end;
        availability.type = type;
        await availability.save();
        return res.json(availability);
      }
    } else {
      const installer = await Installer.findById(installerId);
      if (!installer) {
        return res.status(404).json({ message: 'No such installer found' });
      }

      const serviceIds = installer.services;
      const services = await Service.find({ _id: { $in: serviceIds } });
      if (!services || services.length === 0) {
        return res.status(404).json({ message: 'No services found for this installer' });
      }

      let leastTimeService = null;
      let leastTimeDiff = Infinity;
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const times = await getTimeForService(service._id);
        if (times===null) {
          continue;
        }
        const serviceTimeDiff = times;
        if (serviceTimeDiff < leastTimeDiff) {
          leastTimeDiff = serviceTimeDiff;
          leastTimeService = service;
        }
      }

      if (!leastTimeService) {
        return res.status(404).json({ message: 'Could not find service with least time' });
      }

      const bookingDuration = time_end - time_start;
      if (bookingDuration < leastTimeDiff) {
        return res.status(400).json({ message: `Booking duration is less than required service duration (${leastTimeDiff} minutes)` });
      }

      const newAvailability = new Availability({
        installer_id: installerId,
        date: date,
        time_start: time_start,
        time_end: time_end,
        type:type
      });

      await newAvailability.save();
      return res.json(newAvailability);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAvailabilityByInstallerId = async (req, res) => {
  try {
    const installerId = req.params.installerId;
    const availabilities = await Availability.find({ installer_id: installerId });
    return res.json(availabilities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
