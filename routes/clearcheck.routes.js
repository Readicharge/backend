const express = require('express');
const router = express.Router();


const {clearCheck} = require("../controllers/ClearCheck/ClearCheck.controller");



router.use("/",clearCheck)


module.exports = router;