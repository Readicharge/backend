const Booking = require("../../models/booking.model");
const Time = require("../../models/timePerService.model");
const Installer = require("../../models/installer.model");





const updateStage0Rating = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      const { time, date } = req.body;
      const bookingDate = new Date(booking.date);
      const requestDate = new Date(date);
      if (bookingDate.toDateString() !== requestDate.toDateString()) {
        booking.completion_steps.stage_0.rating = 1;
  
      } else {
        const bookingTime = booking.time_start;
        const requestTime = time;
        const minutesDiff = (requestTime - bookingTime) * 60;
        console.log(minutesDiff)
        if (minutesDiff >= 15) {
          booking.completion_steps.stage_0.rating = 1;
        } else if (minutesDiff >= 10 && minutesDiff < 15) {
          booking.completion_steps.stage_0.rating = 2;
        } else if (minutesDiff >= 5 && minutesDiff < 10) {
          booking.completion_steps.stage_0.rating = 3;
        } else if (minutesDiff >= 0 && minutesDiff < 5) {
          booking.completion_steps.stage_0.rating = 4;
        } else if (minutesDiff >= -30 && minutesDiff < -5) {
          booking.completion_steps.stage_0.rating = 5;
        }
        else {
          booking.completion_steps.stage_0.rating = 3;
        }
      }
      booking.completion_steps.stage_0.status_installer = true;
      await booking.save();
      res.status(200).json({
        message: 'Stage 0 rating updated successfully',
        rating: booking.completion_steps.stage_0.rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
const updateStage1Rating = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      const { time, date } = req.body;
      const bookingDate = new Date(booking.date);
      const requestDate = new Date(date);
      if (bookingDate.toDateString() !== requestDate.toDateString()) {
        booking.completion_steps.stage_1.rating = 1;
      } else {
        const bookingTime = booking.time_start;
        const requestTime = time;
        const hoursDiff = requestTime - bookingTime;
        if (hoursDiff >= 24) {
          booking.completion_steps.stage_1.rating = 1;
        } else if (hoursDiff >= 6 && hoursDiff < 24) {
          booking.completion_steps.stage_1.rating = 2;
        } else if (hoursDiff >= 3 && hoursDiff < 6) {
          booking.completion_steps.stage_1.rating = 3;
        } else if (hoursDiff >= 1 && hoursDiff < 3) {
          booking.completion_steps.stage_1.rating = 4;
        } else {
          booking.completion_steps.stage_1.rating = 5;
        }
      }
      booking.completion_steps.stage_1.status_installer = true;
      await booking.save();
      res.status(200).json({
        message: 'Stage 1 rating updated successfully',
        rating: booking.completion_steps.stage_1.rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
const updateStage2Rating = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      console.log(booking)
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      const { time, date } = req.body;
      const bookingDate = new Date(booking.date);
      const requestDate = new Date(date);
      if (bookingDate.toDateString() !== requestDate.toDateString()) {
        booking.completion_steps.stage_2.rating = 1;
      } else {
        const bookingTimeStart = booking.time_start;
        const requestTime = time;
        const hoursDiff = requestTime - bookingTimeStart;
        const serviceId = booking.service;
        const numberOfInstalls = booking.number_of_installs;
        const timeData = await Time.findOne({ service: serviceId, number_of_installs: numberOfInstalls });
        const timeMin = timeData.time_min;
        const timeMax = timeData.time_max;
        if (hoursDiff <= timeMin) {
          booking.completion_steps.stage_2.rating = 5;
        } else if (hoursDiff < (timeMin + timeMax) / 2) {
          booking.completion_steps.stage_2.rating = 4;
        } else if (hoursDiff < timeMax) {
          booking.completion_steps.stage_2.rating = 3;
        } else if (hoursDiff < timeMax + 2) {
          booking.completion_steps.stage_2.rating = 2;
        } else {
          booking.completion_steps.stage_2.rating = 1;
        }
      }
      booking.completion_steps.stage_2.status_installer = true;
      await booking.save();
      res.status(200).json({
        message: 'Stage 2 rating updated successfully',
        rating: booking.completion_steps.stage_2.rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  
const calculateInstallerRating = async (req, res) => {
    try {
      const bookingId = req.params.bookingId;
      const { userGivenRating } = req.body;
      const booking = await Booking.findById(bookingId);
      const installer = await Installer.findById(booking.installer);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      const { stage_0, stage_1, stage_2 } = booking.completion_steps;
      if (!stage_0.status_installer || !stage_1.status_installer || !stage_2.status_customer) {
        return res.status(400).json({ message: 'Booking stages are not completed yet' });
      }
      const totalRating = stage_0.rating + stage_1.rating + stage_2.rating + userGivenRating;
      const installerRating = Math.round(totalRating / 4);
      booking.completion_steps.overall_completion.status_customer = true;
      booking.completion_steps.overall_completion.rating = installerRating;
      console.log(installerRating)
      installer.ratingsAndReviews = (installer.ratingsAndReviews !== undefined || installer.ratingsAndReviews !==NaN)?(installer.ratingsAndReviews + installerRating)/2:(3 + installerRating)/2;
      await installer.save();
      await booking.save();
      res.status(200).json({ message: 'Installer rating calculated successfully', installerRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };




  module.exports = {
    updateStage0Rating,
    updateStage1Rating,
    updateStage2Rating,
    calculateInstallerRating
  }
