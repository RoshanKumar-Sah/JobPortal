const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
const {getUser } = require("../controller/user");
const router = express.Router();




router.post("/getEmployer",checkAuthentication(process.env.JWT_SECRET_KEY_EMP), getUser)
router.post("/getClient",checkAuthentication(process.env.JWT_SECRET_KEY_CLIENT), getUser)

module.exports = router