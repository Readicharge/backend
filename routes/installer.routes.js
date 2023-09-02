
const express = require('express');
const router = express.Router();
const {createInstaller,deleteInstaller,updateInstaller, getInstallers,getInstallerById}= require('../controllers/installer.controller');
const {validateInstaller_Independent,
    validateInstaller_CompanyInstaller_user_id_exsistence,
    update_User_Password,
    validateInstaller_Company


} = require("../validators/installer.validator")
 
// Create a new installer
router.post('/', createInstaller);
 // Delete an installer by id
router.delete('/:id', deleteInstaller);
 // Update an installer by id
router.put('/:id', updateInstaller);
// get Installer by ID
router.get('/:id',getInstallerById);

// Get all installers
router.get("/",getInstallers);





// Installer Validator
router.post("/Validate",validateInstaller_Independent);
router.post("/validateCompanyUser/",validateInstaller_CompanyInstaller_user_id_exsistence);
router.patch("/Update-Installer-Login-Password",update_User_Password);
router.get("/Validate-Installer-with-UserId",validateInstaller_Company);



module.exports = router;
