const express = require("express");

const app = express();

// CORE FUNCITONS LOGIC STANDS HERE

// Makeing the Routes
const adminRoutes = require('./admin.routes');
const serviceRoutes = require('./service.routes');
const timePerServiceRoutes = require('./timePerService.routes');
const servicePriceRoutes = require('./servicePrice.routes');
const materialRoutes = require('./material.routes');
const LabourRatesRoutes = require('./laborRate.routes');
const PaymentRoutes  = require('./payment.routes');
const InstallerRoutes = require("./installer.routes");
const InstallerWeeklyTimeRoutes = require("./installer_routes/installer_weekly_availability.routes");
const AvailabilityRoutes = require("./installer_routes/installer_availability.routes");
const BookingRoutes = require("./booking.routes");
const RatingRoutes  = require("./rating.routes");
const ClearCheckRoutes = require("./clearcheck.routes");
const CustomerRoutes = require("./user.routes");

// Using the Routes
app.use('/admins', adminRoutes);
app.use('/services',serviceRoutes);
app.use('/time',timePerServiceRoutes);
app.use("/customerRate",servicePriceRoutes);
app.use("/materials",materialRoutes);
app.use("/LabourRates",LabourRatesRoutes);
app.use("/payments",PaymentRoutes);
app.use("/installer",InstallerRoutes);
app.use("/recurring",InstallerWeeklyTimeRoutes);
app.use("/availability",AvailabilityRoutes);
app.use("/booking",BookingRoutes);
app.use("/rating",RatingRoutes);
app.use("/clearcheck",ClearCheckRoutes);
app.use("/customer",CustomerRoutes);





// BUSINESS LOGIC _ INSTALLER APPLICATION 

const installer_phase_2_booking_routes = require('../Business_logic_helper_operations/Installer_app/Installer_App.routes')




app.use('/installer_app',installer_phase_2_booking_routes)



module.exports = app;