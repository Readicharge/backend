const Installer = require("../../../models/installer.model")

// Function to find the most recent admin
exports.findMostRecentInstaller = async (req, res) => {
    try {
      // Find the most recent admin based on the createdAt field in descending order
      const mostRecentJoinedInstaller = await Installer.findOne().sort({ sequence_number: -1 });
      
      if(mostRecentJoinedInstaller===null){
        console.log("The start for the creation of readicharge installer is here")
        return 0;
      }
      return mostRecentJoinedInstaller.sequence_number;
    } catch (error) {
       return null;
    }
  };