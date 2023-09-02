const Admin = require("../../../models/admin.model")

// Function to find the most recent admin
exports.findMostRecentAdmin = async (req, res) => {
    try {
      // Find the most recent admin based on the createdAt field in descending order
      const mostRecentAdmin = await Admin.findOne().sort({ sequence_number: -1 });
      
      if(mostRecentAdmin===null){
        console.log("The start for the creation of super admin is here")
        return 0;
      }
      return mostRecentAdmin.sequence_number;
    } catch (error) {
       return null;
    }
  };