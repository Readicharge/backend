const Schedule = require('../../models/installer_availability/installer_weekly-availability.model');



exports.getScheduleForInstaller = async (req,res) => {
  try {
    const installerId = req.params.installerId;
    const schedules = await Schedule.find({ installer_id:installerId });
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.createOrUpdateSchedule = async (req, res) => {
  try {
    const { installer_id, day, startTime, endTime, active } = req.body;

    // Check if a schedule with the same installer_id and day already exists
    const existingSchedule = await Schedule.findOne({ installer_id, day });

    if (existingSchedule) {
     
      // Case 1 : Already Active Day , and current Active = Change the Timing needed
      if (existingSchedule.active && active) {
        existingSchedule.startTime = startTime;
        existingSchedule.endTime = endTime;
        await existingSchedule.save();
        res.json(existingSchedule);
      }
      // Case 2 : Already Deactive Day , and Curent Active = Activation of the Day and Time fixing Needed
      else if(!existingSchedule.active && active) {
        existingSchedule.startTime = startTime;
        existingSchedule.endTime = endTime;
        existingSchedule.active = true;
        await existingSchedule.save();
        res.json(existingSchedule);
      }
      
      // Case 3 : Current Day Deactive , already Day Active = Deactivation for the day is needed 
      else if(!active && existingSchedule.active) {
        existingSchedule.active = false;   // Deactivation of the Day
        await existingSchedule.save();
        res.json(existingSchedule);
      }
        // Case 4 : Current Day Deactive , Already Deactive = No Change needed
      else if(!active && !existingSchedule.active)
      {
        res.json(existingSchedule);
      }
        
    } else {
      // Create a new schedule
      const schedule = new Schedule({
        installer_id,
        day,
        startTime,
        endTime,
        active,
      });
      await schedule.save();
      res.status(201).json(schedule);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInactiveDates = async (req, res) => {
    try {
      const year = new Date().getFullYear();
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      const { installerId } = req.params;
      const schedules = await Schedule.find({ installer_id:installerId, $or: [{ active: false }, { startTime: { $ne: 7 } }, { endTime: { $ne: 22 } }] });
      const inactiveDates = [];
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const day = date.toLocaleString('default', { weekday: 'long' });
        const schedule = schedules.find(s => s.day === day);
        const isActive = schedule ? schedule.active : true;
        const startTime = schedule ? schedule.startTime : 7;
        const endTime = schedule ? schedule.endTime : 22;
        if (!isActive || startTime !== 7 || endTime !== 22) {
          inactiveDates.push({
            installerId:schedule.installer_id,
            date: date.toISOString().substring(0, 10),
            day,
            startTime,
            endTime,
            active: isActive,
          });
        }
      }
      res.json(inactiveDates);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
