require('dotenv').config();
const axios = require('axios');
const Installer = require('../models/installer.model');
const { findMostRecentInstaller } = require('./UniqueIdGenerator/installer/installerIdGenerator');



// This function is used to calculate the installer location ( latitude and longitude ) based out of the address
// This will take the addressLine1 , state and the zip 

async function getCoordinates(addressLine1, addressLine2, zip, state) {
  try {
    const address = `${addressLine1} ${state} ${zip}`;
    const response = await axios.get('http://api.positionstack.com/v1/forward', {
      params: {
        access_key: process.env.GEO_API_KEY,
        query: address,
        limit: 1,
      },
      timeout: 25000, // Set a reasonable timeout value in milliseconds (e.g., 5000ms = 5 seconds)
    });

    const { data } = response;
    if (data.data.length === 0) {
      throw new Error('Address not found');
    }

    const location = data.data[0];
    const geo = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    return geo;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Request was canceled (due to timeout)
      console.error('API request timed out:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.response) {
      // The server responded with an error status (e.g., 4xx or 5xx)
      console.error('API Error:', error.response.data);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.code === 'ECONNABORTED') {
      // Request timed out
      console.error('API request timed out:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.code === 'ENOTFOUND') {
      // Server not found (domain name not resolved)
      console.error('Server not found:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from the server:', error.request);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else {
      // Other unknown errors
      console.error('Error getting coordinates:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    }
  }
}


  
   // Create a new installer
   const createInstaller = async (req, res) => {
    try {
      const { addressLine1, addressLine2, state, zip, city, ...rest } = req.body;
      const last_sequence_number = await findMostRecentInstaller();
      const current_sequence_number = last_sequence_number + 1;
      const readicharge_unique_id = `RC-I-${current_sequence_number}`;

        const { latitude, longitude } = await getCoordinates(addressLine1, addressLine2, zip, state);
        console.log(latitude, longitude);
   
      
      const installer = await Installer.create({ ...rest,readicharge_unique_id,sequence_number:current_sequence_number, addressLine1, addressLine2, state, zip, city, latitude, longitude
      });
      console.log(installer)
      res.status(201).json(installer);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  };
   // Delete an installer by id
  const deleteInstaller = async (req, res) => {
    try {
      await Installer.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
//   Update the installer by id
  const updateInstaller = async (req, res) => {
    try {
      const installerId = req.params.id;
      const { addressLine1, addressLine2, state, zip, city, ...rest } = req.body;
  
      // Get the current installer object
      const currentInstaller = await Installer.findById(installerId);
  
      // If the address fields are provided, get the updated latitude and longitude
      let latitude = currentInstaller.latitude;
      let longitude = currentInstaller.longitude;
      if (addressLine1 || addressLine2 || zip || state) {
        const coordinates = await getCoordinates(
          addressLine1 || currentInstaller.addressLine1,
          zip || currentInstaller.zip,
          state || currentInstaller.state
        );
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
  
      // Update the installer with the new values
      const updatedInstaller = await Installer.findByIdAndUpdate(
        installerId,
        { ...rest, addressLine1, addressLine2, state, zip, city, latitude, longitude },
        { new: true }
      );
  
      res.status(200).json(updatedInstaller);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };



   // Get a list of all installers
const getInstallers = async (req, res) => {
  try {
    const installers = await Installer.find();
    res.status(200).json(installers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

   // Get installer by Id
const getInstallerById = async (req, res) => {
  try {
    const installerId = req.params.id;
    const installers = await Installer.findById(installerId);
    res.status(200).json(installers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};




  module.exports = {
    createInstaller,
    deleteInstaller,
    updateInstaller,
    getInstallers,
    getInstallerById
  }


