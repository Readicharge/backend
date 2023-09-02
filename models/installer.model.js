// Most crucial one

// models/Installer.js
const mongoose = require('mongoose');




const installerSchema = new mongoose.Schema({
    // The unique Id for the installer
    readicharge_unique_id: {
        type: String,
        required: false
    },
    union:{
        type:String,
        required:false
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
    // This will be for the Comapny assigned Used Id
    company_installer:{
        type:Boolean,
        default:false
    },
    user_id: {
        type: String,
        required: false
    },
    user_profile_completed:{
        type: Boolean,
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
    companyName: {
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
    miles_distance: {
        type: Number,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    yearsOfExperience: {
        type: Number,
    },
    description: {
        type: String,
    },
    licenseNumber: {
        type: String,
        required: false
    },
    licenseExpirationDate: {
        type: Date,
        required: false
    },
    imageLicense: {
        type: Object,
        required: false
    },
    licenseCertified:{
        type: Boolean,
        required: false
    },
    // Not Required for now as we are only going to deal with the installer data
    // pdfLicense: {
    //     type: Object,
    //     required: false
    // },
    businessInsuranceNumber: {
        type: String,
        required: false
    },
    businessInsuranceCompany: {
        type: String,
        required: false
    },
    businessAgentPhoneNumber: {
        type: String,
        required: false
    },
    businessPolicyNumber: {
        type: String,
        required: false
    },
    businessInsuranceEffectiveStartDate: {
        type: Date,
        required: false
    },
    businessInsuranceEffectiveEndDate: {
        type: Date,
        required: false
    },
    imageBusinessInsurance: {
        type: Object,
        required: false
    },
    // pdfBusinessInsurance: {
    //     type: Object,
    //     required: false
    // },
    bondingCertificationNumber: {
        type: String,
    },
    bondingCompany: {
        type: String,
        required: false
    },
    bondingAgentPhoneNumber: {
        type: String,
        required: false
    },
    bondAmount: {
        type: Number,
    },
    bondingEffectiveStartDate: {
        type: Date,
    },
    bondingEffectiveEndDate: {
        type: Date,
    },
    imageBonding: {
        type: Object,
        required: false
    },
    // pdfBonding: {
    //     type: Object,
    //     required: false
    // },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }
    ],
    // serviceArea: {
    //     type: Number,
    // },
    profilePicture: {
        type: String,
        required: false
    },
    // This is the verifiaction status which will be active if the clearCheck is verified positive
    verificationStatus: {
        type: Boolean,
        default: false
    },
        // This will be storing the status for the monthly subscription
    monthySubscribed_Referral: {
        status:{
            type: Boolean,
            defualt: false
        },
        last_transaction_id:{
            type:String,
            defualt:false
        },
        start_date:{
            type:Date,
            required:false
        },
        end_date:{
            type:Date,
            required:false
        }
    },
    // This will be storing the status for the annual subscription
    annualSubscribed_Priority: {
        status:{
            type: Boolean,
            defualt: false
        },
        last_transaction_id:{
            type:String,
            defualt:false
        },
        start_date:{
            type:Date,
            required:false
        },
        end_date:{
            type:Date,
            required:false
        }
    },
    // This will be storing the status for the monthly subscription
    monthySubscribed_Priority: {
        status:{
            type: Boolean,
            defualt: false
        },
        last_transaction_id:{
            type:String,
            defualt:false
        },
        start_date:{
            type:Date,
            required:false
        },
        end_date:{
            type:Date,
            required:false
        }
    },
    // This will be storing the status for the annual subscription
    annualSubscribed_Referral: {
        status:{
            type: Boolean,
            defualt: false
        },
        last_transaction_id:{
            type:String,
            defualt:false
        },
        start_date:{
            type:Date,
            required:false
        },
        end_date:{
            type:Date,
            required:false
        }
    },
    
    ratingsAndReviews: {
        type: Number,
        defualt: 3
    }
    ,
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
    //we need to update this thing to add all the sections for the Stripe account , and this data should be very accurate
    stripePaymentDetails: {
        id: String,
        object: String,
        business_type: String,
        charges_enabled: Boolean,
        country: String,
        created: Number,
        default_currency: String,
        email: String,
        external_accounts: {
            data: [
                {
                    id: String,
                    object: String,
                    account_holder_name: String,
                    account_holder_type: String,
                    account_type: String,
                    bank_name: String,
                    country: String,
                    currency: String,
                    default_for_currency: Boolean,
                    fingerprint: String,
                    last4: String,
                    routing_number: String,
                    status: String
                }
            ]
        },
        individual: {
            id: String,
            object: String,
            account: String,
            address: {
                city: String,
                country: String,
                line1: String,
                line2: String,
                postal_code: String,
                state: String
            },
            created: Number,
            dob: {
                day: String,
                month: String,
                year: String
            },
            first_name: String,
            last_name: String,
            relationship: {
                percent_ownership: String,
                title: String
            }
        },
        payouts_enabled: Boolean
    },
    // Need to add the licensing verification status as well over here
    license_verification_status: {
        type: Boolean,
        default: false
    },
    // need to add the clearcheck status 
    clearCheck_status: {
         verified:{
            type: Boolean,
            default : false
        },
        completed : {
            type : Boolean,
            default : false
        },
        report_key_present:{
            type : Boolean,
            default : false
        },
        report_key:{
            type : String
        }
    },
    changedBy: {
        type: String
    }
});
const Installer = mongoose.model('Installer', installerSchema);
module.exports = Installer;
