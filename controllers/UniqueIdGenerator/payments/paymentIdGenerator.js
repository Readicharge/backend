const Payment = require("../../../models/Payment.model")

// Function to find the most recent admin
const findMostRecentPayment = async (req, res) => {
    try {
      // Find the most recent admin based on the createdAt field in descending order
      const mostrecentDonePayment = await Payment.findOne().sort({ sequence_number: -1 });
      
      if(mostrecentDonePayment===null){
        console.log("The start for the creation of Paymnet in the readicharge Platform is from here")
        return 0;
      }
      return mostrecentDonePayment.sequence_number;
    } catch (error) {
       return null;
    }
  };


module.exports = {findMostRecentPayment}