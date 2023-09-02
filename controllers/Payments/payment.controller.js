const Payment = require("../../models/Payment.model");
const { findMostRecentPayment } = require("../UniqueIdGenerator/payments/paymentIdGenerator")


// Create payment function
const createPayment = async (data) => {
    const {installer_id , isIncoming, payment_type, payment_id, date, amount, Job_Id, Job_Unique_Rc_id, user_id,client_secret } = data;
    const current_sequence_number = await findMostRecentPayment() + 1;
    let paymentFields = {
        client_secret,
        installer_id,
        // user_id,
        payment_type,
        payment_id,
        date,
        amount,
        sequence_number: current_sequence_number,
        Job_Id,
        Job_Unique_Rc_id,
        seen:false,
        isIncoming
    };


    // Generate the sequence number here

    try {
        if (payment_type === 'subscription') {
            delete paymentFields.user_id;
            delete paymentFields.Job_Id;
            delete paymentFields.Job_Unique_Rc_id;
        } else if (payment_type === 'purchase') {
            delete paymentFields.installer_id;
            delete paymentFields.Job_Id;
            delete paymentFields.Job_Unique_Rc_id;
        }
        const payment = new Payment(paymentFields);
        console.log(payment);
        await payment.save();

        return "Success"
    } catch (err) {
        return "Failure"
    }
};

const getPaymentPerInstaller = async ( req, res ) => {
  try {
    const payments = await Payment.find({installer_id:req.params.installerId});
    res.status(200).json(payments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

}



module.exports = { createPayment , getPaymentPerInstaller }
