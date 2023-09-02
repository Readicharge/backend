// Most crucial one

// models/Customer.js
const mongoose = require('mongoose');




const customerSchema = new mongoose.Schema({
    // The unique Id for the Customer
    readicharge_unique_id: {
        type: String,
        required: false
    },
    profile_completed:{
        type:Boolean,
        default:false
    },
    logon_status:{
        type:Boolean,
        default:false
    },
    page_name_done : {
        type:String,
        required:false
    },
    progress:{
        type:Number,
        required:false
    },
    sequence_number:{
        type:Number,
        required:true
    },
    // The First name
    firstName: {
        type: String,
        required: false
    },
    // the last name
    lastName: {
        type: String,
        required: false
    },
    // main Email , should be unique
    email: {
        type: String,
        required: false,
        unique: true
    },
    // the state from US ( to be selected from the Dropdown )
    state: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: false
    },
    addressLine2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    zip: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    bookingsHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
    payments_history: [
        {
            payment_id: {
                type: String
            },
            creation_date: {
                type: Date
            },
            booking_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            }
        }
    ],
    dateOfBirth: {
        type: Date,
    },
    Number_of_bookings: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },

    changedBy: {
        type: String
    }
});
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
