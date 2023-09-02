require('dotenv').config();
const Installer = require('../../models/installer.model');
const Booking = require("../../models/booking.model");
const Payment = require("../../models/Payment.model")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {createPayment} = require("./payment.controller")

const hold_payment_on_card = async (req, res) => {
    try {
        // Get the card details and hold amount from the request body
        const { cardNumber, holderName, expirationDate, cvv, amount,booking_id } = req.body;
        const payment_intent_type = req.params.payment_initiated_type;
        const installer_id = req.params.installerId

        // Create a Payment Intent to hold the amount on the card
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe requires the amount in cents
            currency: 'usd', // Change to your desired currency
            payment_method_data: {
                type: 'card',
                card: {
                    token: 'tok_visa', // Use the test token for the card
                  },
            },
            confirm: true,
            capture_method: 'manual', // Hold the funds but don't capture immediately
        });

        // Get the Payment Intent ID and save it in your database for future reference
        const paymentIntentId = paymentIntent.id;
        // console.log(paymentIntent)
        if (payment_intent_type === 'installer-monthly-subscription-referral') {
            const installer = await Installer.findById(req.params.installerId);
            console.log(installer)
            installer.monthySubscribed_Referral.last_transaction_id = paymentIntentId;
            installer.monthySubscribed_Referral.status = true;
            // Set the start_date as the current date
            installer.monthySubscribed_Referral.start_date = new Date();
            // Set the end_date as one month after the start_date
            installer.monthySubscribed_Referral.end_date = new Date(installer.monthySubscribed_Referral.start_date);
            installer.monthySubscribed_Referral.end_date.setMonth(installer.monthySubscribed_Referral.end_date.getMonth() + 1);
            // Creating the Payment section here
            await createPayment({installer_id:installer_id,isIncoming:true,payment_type:"subscription_referral",payment_id:paymentIntentId,amount,date:installer.monthySubscribed_Referral.start_date,client_secret:paymentIntent.client_secret})
            installer.save();
        }
        else if (payment_intent_type === 'installer-annual-subscription-referral') {
            const installer = await Installer.findById(req.params.installerId);
            console.log(installer)
            installer.annualSubscribed_Referral.last_transaction_id = paymentIntentId;
            installer.annualSubscribed_Referral.status = true;
            // Set the start_date as the current date
            installer.annualSubscribed_Referral.start_date = new Date();
            // Set the end_date as one year after the start_date
            installer.annualSubscribed_Referral.end_date = new Date(installer.annualSubscribed_Referral.start_date);
            installer.annualSubscribed_Referral.end_date.setFullYear(installer.annualSubscribed_Referral.end_date.getFullYear() + 1);
            await createPayment({installer_id:installer_id,isIncoming:true,payment_type:"subscription_referral",payment_id:paymentIntentId,amount,date:installer.annualSubscribed_Referral.start_date,client_secret:paymentIntent.client_secret})
            installer.save();
        }
        else if (payment_intent_type === 'installer-monthly-subscription-priority') {
            const installer = await Installer.findById(req.params.installerId);
            console.log(installer)
            installer.monthySubscribed_Priority.last_transaction_id = paymentIntentId;
            installer.monthySubscribed_Priority.status = true;
            // Set the start_date as the current date
            installer.monthySubscribed_Priority.start_date = new Date();
            // Set the end_date as one month after the start_date
            installer.monthySubscribed_Priority.end_date = new Date(installer.monthySubscribed_Priority.start_date);
            installer.monthySubscribed_Priority.end_date.setMonth(installer.monthySubscribed_Priority.end_date.getMonth() + 1);
            // Creating the Payment section here
            await createPayment({installer_id:installer_id,isIncoming:true,payment_type:"subscription_priority",payment_id:paymentIntentId,amount,date:installer.monthySubscribed_Priority.start_date,client_secret:paymentIntent.client_secret})
            installer.save();
        }
        else if (payment_intent_type === 'installer-annual-subscription-priority') {
            const installer = await Installer.findById(req.params.installerId);
            console.log(installer)
            installer.annualSubscribed_Priority.last_transaction_id = paymentIntentId;
            installer.annualSubscribed_Priority.status = true;
            // Set the start_date as the current date
            installer.annualSubscribed_Priority.start_date = new Date();
            // Set the end_date as one year after the start_date
            installer.annualSubscribed_Priority.end_date = new Date(installer.annualSubscribed_Priority.start_date);
            installer.annualSubscribed_Priority.end_date.setFullYear(installer.annualSubscribed_Priority.end_date.getFullYear() + 1);
            await createPayment({installer_id:installer_id,isIncoming:true,payment_type:"subscription_priority",payment_id:paymentIntentId,amount,date:installer.annualSubscribed_Priority.start_date,client_secret:paymentIntent.client_secret})
            installer.save();
        }
        else if (payment_intent_type === 'customer-job-booking') {
            // Keep this one for the customer one
            const booking = await Booking.findById(booking_id);
            const date_today =  new Date();
            await createPayment({payment_type:"booking",payment_id:paymentIntentId,amount,Job_Id:booking_id,date:date_today,client_secret:paymentIntent.client_secret})
            booking.customer_payment_status = "Paid";
            await booking.save();

        }
        else if (payment_intent_type === 'customer-charger-purchase') {
            // Keep this one for the customer , when he/she puchase the charger
        }
        else if (payment_intent_type === 'company-monthly-subscription') {

        }
        else if (payment_intent_type === 'company-annual-subscription') {

        }

        // Return the Payment Intent ID to the client
        res.json({ message:"Paymnent succeddfully captured" });
    } catch (error) {
        console.error('Error creating hold:', error);
        res.status(500).json({ message: 'Error creating hold' });
    }
};



const refund_hold_with_charge = async (req,res)=>{
   try {
    const {payment_id,amount_to_be_charged} = req.body;
    const payment_intent = await Payment.findById(payment_id);
    const payment_intent_id = payment_intent.payment_id;
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    // console.log(paymentIntent)

    const amount_to_be_refunded = paymentIntent.amount - amount_to_be_charged;
    await stripe.paymentIntents.capture(paymentIntent.id,{amount_to_capture:amount_to_be_charged}
    );
  


    payment_intent.amount=amount_to_be_refunded;
    payment_intent.date = new Date();
    await payment_intent.save();

    res.status(200).json("Success");
   } catch (error) {
    res.status(500).json(error)
   }
}

// function to update the exsisting amount to increase the amount 
const update_price_token = async (req, res) => {
    try {
        const { existing_payment_id, new_amount } = req.body;// the card details are also required

        // Retrieve the existing payment intent
        const existingPaymentIntent = await Payment.findById(existing_payment_id);
        const existingPaymentIntentId = existingPaymentIntent.payment_id;

        // Retrieve the existing payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(existingPaymentIntentId);

        // Calculate the total amount by combining the existing and new amounts
        const totalAmount = paymentIntent.amount + new_amount;

        // Cancels the old payment intent 
        await stripe.paymentIntents.cancel(existingPaymentIntentId);

        // Create a new PaymentIntent with the combined amount
        const updatedPaymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd', // Change to your desired currency
            payment_method_data: {
                type: 'card',
                card: {
                    token: 'tok_visa', // Use the test token for the card
                },
            },
            confirm: true,
            capture_method: 'manual', // Hold the funds but don't capture immediately
        });

        // Update the local payment intent with the new amount and date
        existingPaymentIntent.payment_id = updatedPaymentIntent.id;
        existingPaymentIntent.client_secret = updatedPaymentIntent.client_secret;
        existingPaymentIntent.amount = totalAmount;
        existingPaymentIntent.date = new Date();
        await existingPaymentIntent.save();

        res.status(200).json({ message: 'Payment intent updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};





module.exports = {
    hold_payment_on_card,
    refund_hold_with_charge,
    update_price_token
}
