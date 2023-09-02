const Installer = require("../../../models/customer.model")

// Function to find the most recent admin
exports.findMostRecentCustomer = async (req, res) => {
    try {
      // Find the most recent admin based on the createdAt field in descending order
      const mostRecentJoinedCustomer = await Customer.findOne().sort({ sequence_number: -1 });
      
      if(mostRecentJoinedCustomer===null){
        console.log("The start for the creation of readicharge Customer is here")
        return 0;
      }
      return mostRecentJoinedCustomer.sequence_number;
    } catch (error) {
       return null;
    }
  };