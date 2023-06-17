const express = require("express");
const checkAuthentication = require("../middleware/checkAuthentication");
const {getUser } = require("../controller/user");
const router = express.Router();




router.get("/getEmployer",checkAuthentication(process.env.JWT_SECRET_KEY_EMP), getUser)
router.get("/getClient",checkAuthentication(process.env.JWT_SECRET_KEY_CLIENT), getUser)

module.exports = router