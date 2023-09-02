const Installer = require('../models/installer.model')

const validateInstaller_Independent = async (req, res) => {

    try {
      const { email, password } = req.body;
      const installer = await Installer.findOne({ email, password });
      if (installer) {
        res.json({ valid: true , data:installer });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      res.status(500).json({ error: error});
    }
  };



  const validateInstaller_CompanyInstaller_user_id_exsistence  = async (req,res) => {
    try {
     const { userId }   = req.body;
        console.log(userId)
     const installer = await Installer.findOne({ user_id:userId });
     if (installer) {
        res.json({ valid: true , data:installer });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
          res.status(500).json({ error: error});
    }
 }


 const update_User_Password = async (req,res) => {
    try {
        const { email,password } = req.body;
        
        const installer = await Installer.findOne({email});
        console.log(installer)
        if (installer) {
           installer.password = password;
           await installer.save();
           res.status(200).json("Installer Password has been updated successfully !!");
         } else {
           res.status(500).json("Installer Not found Or the Password is incorrect")
         }
       } catch (error) {
           res.status(500).json(`Error has been occured :${error}`)
       }
 } 



 const validateInstaller_Company = async(req,res) => {
    try {
     const { userId , password_given_by_the_installer } = req.body;
     const installer = await Installer.findOne({ user_id:userId });
     if (installer[0].password === password_given_by_the_installer) {
        res.json({ valid: true , data:installer[0] });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
        res.status(500).json(`Error has been Occured : ${error}`)
    }
 }



  module.exports = {
    validateInstaller_Independent,
    validateInstaller_CompanyInstaller_user_id_exsistence,
    update_User_Password,
    validateInstaller_Company

  };





