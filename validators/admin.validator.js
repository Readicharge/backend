const Admin = require('../models/admin.model')

const validateAdmin = async (req, res) => {

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email, password });
      if (admin) {
        res.json({ valid: true , roles:admin.roles });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while validating the admin.' });
    }
  };

  module.exports = {
    validateAdmin
  };