const Time = require('../models/timePerService.model');

exports.getTimeForService = async (serviceId) => {
    try {
      const times = await Time.find({ service_id: serviceId });
      console.log(times);
      if (times.length === 0) {
        console.log(times.length)
        return null
      }
      let minTimeDiff = Infinity;
      let selectedTime = null;
      let max_time = null;
      for (let i = 0; i < times.length; i++) {
        const { time_max } = times[i];
        const timeDiff = time_max;
        if (timeDiff <= minTimeDiff) {
          selectedTime = times[i];
          minTimeDiff = timeDiff;
          max_time = time_max;
        }
      }
      console.log(max_time)
      return max_time
    } catch (error) {
      console.error(error);
      return null
    }
};