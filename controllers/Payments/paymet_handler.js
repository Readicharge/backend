require('dotenv').config();
const Booking = require('../../models/booking.model');
const Installer = require('../../models/installer.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const charge_Hold_amount_from_card = async (req, res) => {
    try {
        // Find the installer from the params


        // Get the last transaction ID from the appropriate subscription field based on the payment_intent_type
        let lastTransactionId;
        const payment_intent_type = req.params.payment_initiated_type;
        if (payment_intent_type === 'installer-monthly-subscription') {
            const installer = await Installer.findById(req.params.id);
            if (!installer) {
                return res.status(404).json({ message: 'Installer not found' });
            }
            lastTransactionId = installer.monthySubscribed.last_transaction_id;
        } else if (payment_intent_type === 'installer-annual-subscription') {
            const installer = await Installer.findById(req.params.id);
            if (!installer) {
                return res.status(404).json({ message: 'Installer not found' });
            }
            lastTransactionId = installer.annualSubscribed.last_transaction_id;
        } else if (payment_intent_type === "Job-ticket-booking") {
            //    adding the customer here to reterieve the payment data done by him/her
            //    The booking model is going to store the data for the payment Intent + The Customer will be storing the payment intents for the backup plans

            const booking = await Booking.findById(req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            console.log(booking._id)
            // This last transaction Id generated when the UserSuper_admin is creating the job ticket
            lastTransactionId = booking.payment_status.payment_id;
        }

        if (!lastTransactionId) {
            return res.status(400).json({ message: 'Transaction ID not found' });
        }

        // Use the Stripe API to capture the held amount on the card
        const paymentIntent = await stripe.paymentIntents.capture(lastTransactionId);

        // Check the paymentIntent status to see if the capture was successful
        if (paymentIntent.status === 'succeeded') {
            if (payment_intent_type === "Job-ticket-booking") {
                const booking = await Booking.findById(req.params.id);
                booking.payment_status.amount_captured_from_customer_card = true;
            }
            // Make the code for rest of the cases likewise
            // Return a success message to the client
            return res.json({ message: 'Payment successfully captured' });
        } else {
            // Handle any errors or specific scenarios based on the paymentIntent status
            return res.status(500).json({ message: 'Payment capture failed' });
        }
    } catch (error) {
        console.error('Error capturing payment:', error);
        return res.status(500).json({ message: 'Error capturing payment' });
    }
};



module.exports = { charge_Hold_amount_from_card }
