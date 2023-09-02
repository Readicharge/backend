require('dotenv').config();
const Booking = require('../../models/booking.model');
const LabourRate = require('../../models/laborRate.model');
const Material = require('../../models/material.model');
const CustomerRate = require('../../models/servicePrice.model');
const Time = require("../../models/timePerService.model")
const Availability = require("../../models/installer_availability/installer_availability.model")
const Installer = require("../../models/installer.model");
const Schedule = require("../../models/installer_availability/installer_weekly-availability.model");
const axios = require("axios");
const _ = require('lodash');
const Installer_Parked = require('../../models/installer_availability/installer_parked.model');





const createBooking = async (req, res) => {
    let valueCollector = [];
    try {
        const { machinePurchasedByUser = true,user_id, service, date, paymentStatus, completionStatus, number_of_installs, material_details, charger_details, installer_id, state, changedBy } = req.body;
        // Calculate labourRates based on the service_id, number_of_installs, and state
        const labourRatesObj = await LabourRate.findOne({ service_id: service, number_of_installs: number_of_installs });
        const labourRates = labourRatesObj.price_statewise.find((priceObj) => priceObj.state === state).price;
        // Calculate materialCost and materialTax based on the selected materials and state
        let materialCosttemp = 0;
        for (const material of material_details) {
            const materialObj = await Material.findById(material.material_id);
            console.log(materialObj)
            const materialPrice = materialObj.price;
            valueCollector.push(materialPrice);
            if (!isNaN(materialPrice)) {
                materialCosttemp += (materialPrice) * material.number_of_materials;
            }
        }
        const materialCost = materialCosttemp;
        // Calculate customerShowingCost based on the service and number_of_installs
        const customerRate = await CustomerRate.findOne({ service_id: service, installs: number_of_installs });
        const time = await Time.findOne({ service_id: service, installs: number_of_installs });
        const customerShowingCost = customerRate.price;
        const booking = new Booking({
            // user: req.user_id,
            machinePurchasedByUser,
            user:user_id,
            installer: installer_id, // Replace this with the actual installer ID
            service,
            time_start: time.time_min,
            time_end: time.time_max,
            date,
            paymentStatus,
            completionStatus,
            labourRates,
            materialCost: materialCost,
            customerShowingCost,
            number_of_installs,
            material_details,
            charger_details,
            changedBy,
            completion_steps:{
                overall_completion:{
                    status_customer :false,
                    rating:0
                },
                stage_0:{
                    status_installer:false,
                    rating:0
                },
                stage_1:{
                    status_installer:false,
                    rating:0
                },
                stage_2:{
                    status_installer:false,
                    status_customer:false,
                    rating:0
                }
            },
            job_modifying_ability_to_customer:false,
                job_modified_status:false,
                customer_payment_status:"Pending",
                completionStatus:false,
                payment_status:{
                    payment_id:"",
                    amount_taken_from_customer:"0",
                    amount_captured_from_customer_Card:false
                }
        });

        // set the Installer status booked for that day
        const parked_installer_status = await Installer_Parked.find({ installer_id: installer_id, date: date });
        if (parked_installer_status.length === 0) {
            const new_parking_secton_for_this_installer = new Installer_Parked({
                installer_id: installer_id,
                date: date,
                installer_booked: true,
                installer_parked: true,
            });

            await booking.save();
            await new_parking_secton_for_this_installer.save();
            res.status(201).json({ booking_id: booking._id, installer_id: booking.installer, amount: customerShowingCost });

        }
        else {
            if(!parked_installer_status[0].installer_booked){
                await booking.save();
                parked_installer_status[0].installer_booked = true;
                await parked_installer_status[0].save();
                res.status(201).json({ booking_id: booking._id, installer_id: booking.installer, amount: customerShowingCost });
            }
            else {
                res.status(201).json("This Installer is already booked")
            }
        }





    } catch (error) {
        console.log(error);

        res.status(500).json({ message: valueCollector });
    }
};


const getBookingById = async (req, res) => {
    try {
      const bookingId = req.params.id;
      const bookings = await Booking.findById(bookingId);
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get bookings' });
    }
  }



const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        await Installer_Parked.findOneAndDelete({installer_id:booking.installer,date:booking.date});

        // Initaite Refund here
        

        const deletedBooking = await Booking.deleteOne({ _id: bookingId });
        res.json(deletedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
}

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const updatedFields = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Merge the updated fields with the existing booking data
        const mergedBooking = _.merge(booking, updatedFields);

        // Save the updated booking
        const updatedBooking = await mergedBooking.save();

        res.json(updatedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update booking' });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get bookings' });
    }
}

const getBookingsByInstaller = async (req, res) => {
    try {
        const installerId = req.params.id;
        const bookings = await Booking.find({ installer: installerId });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get bookings by installer' });
    }
}

const getBookingsByCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const bookings = await Booking.find({ user: customerId });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get bookings by installer' });
    }
}


const getBookingsForInstallerAndActiveStatus = async (req, res) => {
    try {
        const { installerId, status } = req.params; // Get installerId and status from params

        console.log('Installer ID:', installerId);
        console.log('Status:', status);

        const bookings = await Booking.find({ installer: installerId, completionStatus: status });

        console.log('Bookings:', bookings);

        res.status(200).json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};





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
            if (minutesDiff >= 15) {
                booking.completion_steps.stage_0.rating = 1;
            } else if (minutesDiff >= 10 && minutesDiff < 15) {
                booking.completion_steps.stage_0.rating = 4;
            } else if (minutesDiff >= 0 && minutesDiff < 10) {
                booking.completion_steps.stage_0.rating = 3;
            } else if (minutesDiff >= -5 && minutesDiff < 0) {
                booking.completion_steps.stage_0.rating = 4;
            } else if (minutesDiff >= -30 && minutesDiff < -5) {
                booking.completion_steps.stage_0.rating = 5;
            }
            else {
                booking.completion_steps.stage_0.rating = 5;
            }
        }
        booking.completion_steps.stage_0.status_customer = true;
        booking.save();
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
        booking.completion_steps.stage_1.status_customer = true;
        booking.save();
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
            const bookingTimeEnd = booking.time_end;
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
        booking.completion_steps.stage_0.status_customer = true;
        booking.save();
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
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const { stage_0, stage_1, stage_2 } = booking.completion_steps;
        if (!stage_0.status_customer || !stage_1.status_customer || !stage_2.status_customer) {
            return res.status(400).json({ message: 'Booking stages are not completed yet' });
        }
        const totalRating = stage_0.rating + stage_1.rating + stage_2.rating;
        const installerRating = Math.round(totalRating / 3);
        booking.completion_steps.overall_completion.status_customer = true;
        booking.completion_steps.overall_completion.rating = installerRating;
        booking.completion_steps.stage_0.status_customer = true;
        await booking.save();
        res.status(200).json({ message: 'Installer rating calculated successfully', installerRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Z_this is in the testing phase 

// Get coordinates for the given address using OpenStreetMap





// Find the nearest installer for the given address
const getNearestInstaller = async (req, res) => {
    try {

        //  importing the required fileds 
        const { addressLine1, addressLine2, zip, state, date, question_set, number_of_installs, slot_time } = req.body;

        // Getting te service Id 
        const serviceId = await service_determiner(question_set);
        // check whether that number of installs for that service is available or not 
        const getServicecompletionTime = await Time.find({ service_id: serviceId, number_of_installs: number_of_installs });
        const slot_time_end = getServicecompletionTime[0].time_min + slot_time;
        // console.log(req.body)
        // getting the latitude and the longitude of the user enterd address where booking has to be done
        const geo = await getCoordinates(addressLine1, addressLine2, zip, state);
        console.log(geo);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;
        let nearestInstaller = [];
        // finding the list of installers in that particular state
        const installers = await Installer.find({
            state: state,
            services: { $in: [serviceId] }
        }).exec();
        console.log(`installers state : ${installers}`);
        // console.log(geo)
        installers.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);
            // finding the distance between the installer address and the user address and if the distance is under the working 
            // area of the installer then the installer is added to the list for further evaluation 
            console.log(`miles:${installer.miles_distance} && distance between address :${distance}`)
            if (distance <= installer.miles_distance) {
                nearestInstaller.push({
                    installer: installer,
                    distance: distance
                });
            }
        });

        // Sort the nearestInstaller array based on the distance in ascending order
        nearestInstaller.sort((a, b) => a.distance - b.distance);

        // Extract the sorted installers from the nearestInstaller array
        const sortedInstallers = nearestInstaller.map((item) => item.installer);




        // // Now will check for the availability on that given date , whether the particular installer 
        // from the list of installer is booked or not for that day 
        const availableInstallers = [];
        for (const installer of sortedInstallers) {
            const Booked_Installer_On_Given_Date = await Booking.find({
                installer: installer._id,
                date: date
            });

            if (Booked_Installer_On_Given_Date.length === 0) {
                availableInstallers.push(installer);
            }
        }
        console.log(`availableInstallers:${availableInstallers}`)
        // Now wil check for the Availability based out of the selection , 
        //wheter the filtered installer are on week off or have the other timing as well 
        const day = new Date(date).toLocaleString('default', { weekday: 'long' });
        const freeInstallers = []
        for (const installer of availableInstallers) {
            // Finding that the particular Installer is  having a recurring schedule on the day
            const schedules = await Schedule.find({ installerId: installer._id, day: day });
            // Finding that the particular Installer is having the Availability on that day or not 
            const availableInstallers_onSpecific_Date = await Availability.find({ installer_id: installer._id, date: date })

            if (getServicecompletionTime.length === 0) console.log("error here")
            else {
                // If none of the thing is mentioned 
                if (getServicecompletionTime.length > 0 && availableInstallers_onSpecific_Date.length === 0 && schedules.length === 0) freeInstallers.push({ installer: installer, weekly_schedule: schedules, monthly_schedule: availableInstallers_onSpecific_Date });
                else {

                    const InstallerTimeWindow_onDate = (schedules.length === 0) ? getServicecompletionTime[0].time_min : (schedules[0].endTime - schedules[0].startTime);
                    const availInstaller_specificDate_timeDiff = (availableInstallers_onSpecific_Date.length === 0) ? getServicecompletionTime[0].time_min : (availableInstallers_onSpecific_Date[0].time_end - availableInstallers_onSpecific_Date[0].time_start);

                    console.log(`The time is ${getServicecompletionTime[0]}`)
                    if (getServicecompletionTime[0].time_min <= InstallerTimeWindow_onDate && (availInstaller_specificDate_timeDiff <= InstallerTimeWindow_onDate)) {
                        freeInstallers.push({ installer: installer, weekly_schedule: schedules, monthly_schedule: availableInstallers_onSpecific_Date });
                    }
                }
            }
        }
        console.log(`free installer ${freeInstallers}`)
        // will check for the rating 
        freeInstallers.sort((a, b) => b.ratingAndReviews - a.ratingAndReviews);
        if (freeInstallers.length > 0) {
            let finalized_installer_list = [];

            for (const installer_data of freeInstallers) {

                // Finding the Installer Status of Parked on that date 
                const parked_installer_status = await Installer_Parked.find({ installer_id: installer_data.installer._id, date: date })

                if (!parked_installer_status[0].installer_booked && !parked_installer_status[0].installer_parked) {
                    if (installer_data.weekly_schedule.length === 0 && installer_data.monthly_schedule.length === 0) {
                        finalized_installer_list.push(installer_data.installer);
                    }
                    else if (installer_data.weekly_schedule.length > 0) {
                        if (installer_data.monthly_schedule.length > 0) {
                            let installer_set_schedule = installer_data.monthly_schedule[0].end_time - installer_data.monthly_schedule[0].start_time;
                            let user_asked_schedule = slot_time_end - slot_time;
                            if (user_asked_schedule <= installer_set_schedule) {
                                finalized_installer_list.push(installer_data.installer);
                            }
                        }
                        else {
                            let installer_set_schedule = installer_data.weekly_schedule[0].endTime - installer_data.weekly_schedule[0].startTime;
                            let user_asked_schedule = slot_time_end - slot_time;
                            if (user_asked_schedule <= installer_set_schedule) {
                                finalized_installer_list.push(installer_data.installer);
                            }
                        }
                    }
                    else if (installer_data.monthly_schedule.length > 0) {
                        let installer_set_schedule = installer_data.monthly_schedule[0].end_time - installer_data.monthly_schedule[0].start_time;
                        let user_asked_schedule = slot_time_end - slot_time;
                        if (user_asked_schedule <= installer_set_schedule) {
                            finalized_installer_list.push(installer_data.installer);
                        }
                    }
                }
            }
            console.log(finalized_installer_list)
            const selectd_installer = await Installer.findById(finalized_installer_list[0]._id);
            const parked_status_for_selected_installer = await Installer_Parked.find({ installer_id: finalized_installer_list[0]._id, date: date });
            // set the Installer status booked for that day
            if (parked_installer_status.length === 0) {
                const new_parking_secton_for_this_installer = new Installer_Parked({
                    installer_id: finalized_installer_list[0]._id,
                    date: date,
                    installer_booked: true,
                    installer_parked: true,
                })
                await new_parking_secton_for_this_installer.save();
            }
            else {
                parked_status_for_selected_installer[0].installer_booked = true;
                await parked_status_for_selected_installer[0].save();
            }
            await selectd_installer.save();
            res.status(200).json(finalized_installer_list[0]);
        }
        else res.status(500).json("The specified Number of Installation is currently not Provided for this service")

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// FUNCTION TO GET THE COORDINATES BASED ON THE ADDRESS FROM THE THIRD PARTY API 
async function getCoordinates(addressLine1, addressLine2, zip, state) {
    try {
        const address = `${addressLine1} ${addressLine2} ${state} ${zip}`;
        const response = await axios.get('http://api.positionstack.com/v1/forward', {
            params: {
                access_key: process.env.GEO_API_KEY,
                query: address,
                limit: 1,
            },
        });
        const { data } = response;
        if (data.data.length === 0) {
            throw new Error('Address not found');
        }
        const location = data.data[0];
        const geo = {
            latitude: location.latitude,
            longitude: location.longitude,
        };
        return geo;
    } catch (error) {
        console.log(error);
        throw new Error('Error getting coordinates');
    }
}

// Get the distance between two sets of coordinates using the Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(distance)
    return distance;
}
// Convert degrees to radian
function toRadians(degrees) {
    const radians = (degrees * Math.PI) / 180;
    return radians;
}



const findListOfInstallers = async (req, res) => {
    try {
        const { addressLine1, addressLine2, zip, state, date, question_set, number_of_installs } = req.body;

        const serviceId = await service_determiner(question_set);
        // Getting the latitude and longitude of the user 
        const geo = await getCoordinates(addressLine1, addressLine2, zip, state);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;
        let nearestInstaller = [];

        // Finding the list of installers in that particular state for that service
        const installers = await Installer.find({
            state: state,
            services: { $in: [serviceId] }
        }).exec();

        installers.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);
            // finding the distance between the installer address and the user address and if the distance is under the working 
            // area of the installer then the installer is added to the list for further evaluation 
            console.log(`miles:${installer.miles_distance} && distance between address :${distance}`)
            if (distance <= installer.miles_distance) {
                nearestInstaller.push({
                    installer: installer,
                    distance: distance
                });
            }
        });

        // Sort the nearestInstaller array based on the distance in ascending order
        nearestInstaller.sort((a, b) => a.distance - b.distance);

        // Extract the sorted installers from the nearestInstaller array
        const sortedInstallers = nearestInstaller.map((item) => item.installer);

        // Now will check for the availability on that given date , whether the particular installer 
        // from the list of installer is booked or not for that day 
        const availableInstallers = [];
        for (const installer of sortedInstallers) {
            const Booked_Installer_On_Given_Date = await Booking.find({
                installer: installer._id,
                date: date
            });

            if (Booked_Installer_On_Given_Date.length === 0) {
                availableInstallers.push(installer);
            }
        }
        // Now wil check for the Availability based out of the selection , 
        //wheter the filtered installer are on week off or have the other timing as well 
        const day = new Date(date).toLocaleString('default', { weekday: 'long' });
        const freeInstallers = []
        for (const installer of availableInstallers) {
            // Finding that the particular Installer is  having a recurring schedule on the day
            const schedules = await Schedule.find({ installerId: installer._id, day: day });
            // Finding that the particular Installer is having the Availability on that day or not 
            const availableInstallers_onSpecific_Date = await Availability.find({ installer_id: installer._id, date: date })
            // check whether that number of installs for that service is available or not 
            const getServicecompletionTime = await Time.find({ service_id: serviceId, number_of_installs: number_of_installs });
            if (getServicecompletionTime.length === 0) console.log("error here")
            else {
                // If none of the thing is mentioned 
                if (getServicecompletionTime.length > 0 && availableInstallers_onSpecific_Date.length === 0 && schedules.length === 0) freeInstallers.push(installer);
                else {

                    const InstallerTimeWindow_onDate = (schedules.length === 0) ? getServicecompletionTime[0].time_min : (schedules[0].endTime - schedules[0].startTime);
                    const availInstaller_specificDate_timeDiff = (availableInstallers_onSpecific_Date.length === 0) ? getServicecompletionTime[0].time_min : (availableInstallers_onSpecific_Date[0].time_end - availableInstallers_onSpecific_Date[0].time_start);

                    console.log(`The time is ${getServicecompletionTime[0]}`)
                    if (getServicecompletionTime[0].time_min <= InstallerTimeWindow_onDate && (availInstaller_specificDate_timeDiff <= InstallerTimeWindow_onDate)) {
                        freeInstallers.push(installer);
                    }
                }
            }
        }
        console.log(`free installer ${freeInstallers}`)
        // will check for the rating 
        freeInstallers.sort((a, b) => b.ratingAndReviews - a.ratingAndReviews);
        if (freeInstallers.length > 0) {
            let freeInstallers_timeSlot = [];
            for (const installer in freeInstallers) {

                // Finding that the particular Installer is  having a recurring schedule on the day
                const schedules_of_installer_on_that_day = await Schedule.find({ installerId: installer._id, day: day });
                // Finding that the particular Installer is having the Availability on that day or not 
                const availableInstallers_onSpecific_Date = await Availability.find({ installer_id: installer._id, date: date });
                // Finding the Installer Status of Parked on that date 
                const parked_installer_status = await Installer_Parked.find({ installer_id: installer._id, date: date })

                if (!parked_installer_status[0].installer_parked && !parked_installer_status[0].installer_booked) {
                    if (schedules_of_installer_on_that_day.length === 0 && availableInstallers_onSpecific_Date.length === 0) {
                        freeInstallers_timeSlot.push({ start_time: 7, end_time: 19 });
                    }
                    else if (schedules_of_installer_on_that_day.length > 0) {
                        if (availableInstallers_onSpecific_Date.length > 0) {
                            freeInstallers_timeSlot.push({
                                start_time: availableInstallers_onSpecific_Date[0].time_start,
                                end_time: availableInstallers_onSpecific_Date[0].time_end
                            });
                        }
                        else {
                            freeInstallers_timeSlot.push({
                                start_time: schedules_of_installer_on_that_day[0].startTime,
                                end_time: schedules_of_installer_on_that_day[0].endTime
                            })
                        }
                    }
                    else if (availableInstallers_onSpecific_Date.length > 0) {
                        freeInstallers_timeSlot.push({
                            start_time: availableInstallers_onSpecific_Date[0].time_start,
                            end_time: availableInstallers_onSpecific_Date[0].time_end
                        });
                    }
                }
            }
            res.status(200).json(freeInstallers_timeSlot);

        }
        else res.status(500).json("The specified Number of Installation is currently not Provided for this service")


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}


module.exports = {
    createBooking, updateBooking, deleteBooking, getBookingsByInstaller, getAllBookings,getBookingsByCustomer,
    getBookingsForInstallerAndActiveStatus,
    updateStage0Rating,
    updateStage1Rating,
    updateStage2Rating,
    calculateInstallerRating,
    findListOfInstallers,
    getNearestInstaller,
    getBookingById
}
