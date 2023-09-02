const express = require('express');

const Account_Addition_Controller = require('../controllers/Payments/accountAddition.RC_platform_users');
const Payment_Activator = require("../controllers/Payments/hold_payment_on_card");
const Payment_Completor = require("../controllers/Payments/paymet_handler");
const Transfers_Controller = require("../controllers/Payments/transfer_paymnet");
const Payment_Controller = require("../controllers/Payments/payment.controller");

const router = express.Router();


// Adding the UserEnd Bank Account to the stripe and then to the RC platform ,
//  so that we can pay them in the future for the job
router.post('/create-bank-account/:installerId', Account_Addition_Controller.addBankAccount);
router.put('/:installerId/bank-account', Account_Addition_Controller.updateBankAccount);
router.delete('/:installerId/bank-account', Account_Addition_Controller.deleteBankAccount);
router.put('/hold-payment/:installerId/:payment_initiated_type', Payment_Activator.hold_payment_on_card);
router.put('/complete-hold-transaction/:id/:payment_initiated_type',Payment_Completor.charge_Hold_amount_from_card);
router.put('/transfer-funds/:userType/:userId', Transfers_Controller.transfer_paymnet);    
router.post('/refund-hold-payment',Payment_Activator.refund_hold_with_charge);
router.post('/job-scope-updated',Payment_Activator.update_price_token);
// Get the Payments Per Installer 
router.get('/installer/:installerId',Payment_Controller.getPaymentPerInstaller);


module.exports = router;







