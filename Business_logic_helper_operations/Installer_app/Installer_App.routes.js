const express = require('express');
const router = express.Router();


const {handle_I_have_arrived,handle_I_have_Started_the_Job,handle_Complete_Pending_Job,handle_Complete_Complete_job } = require('./phase_2_(home_screen)/booking/index');
const {getPriceByState} = require("./phase_1_(create_installer)/getLabor_rate_per_state")





router.put('/handle_I_have_arrived/:bookingId',handle_I_have_arrived);
router.put("/handle_I_have_Started_the_Job/:bookingId",handle_I_have_Started_the_Job);
router.put("/handle_Complete_Pending_Job/:bookingId",handle_Complete_Pending_Job);
router.put("/handle_Complete_Complete_job/:bookingId",handle_Complete_Complete_job);
router.put("/getPriceByState",getPriceByState);




module.exports = router;