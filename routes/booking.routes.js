const express = require('express');
const router = express.Router();
 const bookingController = require("../controllers/Booking/booking.controller");
router.post("/",bookingController.createBooking);
router.get("/",bookingController.getAllBookings);
router.get("/installer/:id",bookingController.getBookingsByInstaller);
router.get("/customer/:id",bookingController.getBookingsByCustomer);
// router.get("/user/:id",bookingController.getBookingsByUser);
router.delete("/:id",bookingController.deleteBooking);
router.put("/:id",bookingController.updateBooking);
router.get("/Complete_Installer/:installerId/:status", bookingController.getBookingsForInstallerAndActiveStatus);
// Route for getting the list of installers in the particular area 
router.get("/find_available_installer_list",bookingController.findListOfInstallers);
// Route for getting the installer for the selection 
router.get("/find_installer/",bookingController.getNearestInstaller);
// Route to find whether an address has any installers there or not 
router.get("/find_installer_zipcode",bookingController.installerAvailability);
// Route for getting the Job By its id
router.get("/:id",bookingController.getBookingById);




// Section for the Ratings 
router.put("/verification/stage-0/:bookingId",bookingController.updateStage0Rating)  // for verification of the stage 0 and for the rating setup
router.put("/verification/stage-1/:bookingId",bookingController.updateStage1Rating)  // for verification of the stage 1 and for the rating setup
router.put('/verification/stage-2/:bookingId',bookingController.updateStage2Rating); // for verification of the stage 2 and for the rating setup
router.put('/rating/:bookingId', bookingController.calculateInstallerRating);
 module.exports = router;
