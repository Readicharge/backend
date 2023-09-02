const axios = require('axios');
const Booking = require('../../../../models/booking.model');
const { getCurrentTimeWithSixDecimals } = require('../../../../Business_logic_store_room/get_current_time_in_decimal_format');




// Getting the List of all the bookings assigned to the installer 
// URL : base url/api/installer/
// Frontend notes :
// For each of the booking we have to add the logic that the job two buttons "I have arrived " and " I have started worling"
// will be shouwn only if the time difference btw the current time and the job schedule is less that or equal to 12 hrs




// Updating the Job ticket button status "I have arrived"
// URL : base url/api/booking/
// Additional Operation :
// here when the status for the "I have arrived" is trigerred then few things will start over here

const handle_I_have_arrived = async (req,res) => {

     const booking_id = req.params.bookingId;
    //  Thouugh the req.body is passed but there is not need of it 

     const booking = await Booking.findById(booking_id);

     const date = new Date();
     const time = await getCurrentTimeWithSixDecimals();

     await axios.put(`${process.env.BASE_BACKEND_URL}/rating/update_stage_0_rating/${booking_id}`,{
        time: time,
        date: date
     });
      
     console.log(booking)
     // Update the ability for the customer to modify the job scope 
     booking.completion_steps.job_modyfying_ability_to_customer= true;;
     booking.completion_steps.stage_0.status_installer = true;

     await booking.save();
    
     res.status(200).json({
         message: 'Installer has marked as arrived'
     });

}



// Now when This button I have started the work is clicked , it means that the job is verified to have no changes then at this point of time 
// the amount which was held in the stripe is charged and is received to the readicharge bank account

const handle_I_have_Started_the_Job = async (req,res) => {
    const booking_id = req.params.bookingId;
    //  Thouugh the req.body is passed but there is not need of it 

     const booking = await Booking.findById(booking_id);
     booking.completion_steps.stage_1.status_installer = true;
     await booking.save();

     const date = new Date();
     const time = await getCurrentTimeWithSixDecimals();

     await axios.put(`${process.env.BASE_BACKEND_URL}/rating/update_stage_1_rating/${booking_id}`,{
        time: time,
        date: date
     });

    //  The particular amount is charged from the bank account of the user
    await axios.put(`${process.env.BASE_BACKEND_URL}/payments/complete-hold-transaction/${booking_id}/Job-ticket-booking`,{
        time: time,
        date: date
     });


     res.status(200).json({
        message: 'Installer has started his job'
    });

    
}



// Job Mark as completed with pending state 
const handle_Complete_Pending_Job = async (req,res) =>{

    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);

    const date = new Date();
    const time = await getCurrentTimeWithSixDecimals();

    await axios.put(`${process.env.BASE_BACKEND_URL}/rating/update_stage_2_rating/${booking_id}`,{
        time: time,
        date: date
     });

    const UserhasVerified = false //This is going to use this for the customer to verify || if the update is not coming since last 24 hours then automatically set to true
    // Api call for releasing the material charge to the Installer
    await axios.put(`${process.env.BASE_BACKEND_URL}/payments/transfer-funds/Installer/${booking.installer}`,{
        amount : booking.materialCost
    });
    
    booking.completion_steps.stage_2.status_installer = true;
    await booking.save();

    res.status(200).json({
        message: 'Installer has marked that the job is pending complete'
    });
}


// Job Mark as complete with complete state
const handle_Complete_Complete_job = async ( req,res ) => {
    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);
    // const {user_given_rating} = req.body;

    booking.completion_steps.stage_2.status_installer = true;
   await booking.save();

    const date = new Date();
    const time = await getCurrentTimeWithSixDecimals();

    await axios.put(`${process.env.BASE_BACKEND_URL}/rating/update_stage_2_rating/${booking_id}`,{
        time: time,
        date: date
     });

    // await axios.put(`${process.env.BASE_BACKEND_URL}/rating/calculate_installer_rating/${booking_id}`,{
    //     userGivenRating:user_given_rating
    // });

    const UserhasVerified = false //This is going to use this for the customer to verify || if the update is not coming since last 24 hours then automatically set to true
    // Api call for releasing the material charge to the Installer
    await axios.put(`${process.env.BASE_BACKEND_URL}/payments/transfer-funds/Installer/${booking.installer}`,{
        amount : booking.materialCost;
    });

    res.status(200).json({
        message: 'Installer has marked that the job is Complete complete'
    });
}


// 





module.exports = {
    handle_I_have_arrived,
    handle_I_have_Started_the_Job,
    handle_Complete_Pending_Job,
    handle_Complete_Complete_job
}


