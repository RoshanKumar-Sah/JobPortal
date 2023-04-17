const express = require("express")
const router = express.Router()
var jwt = require('jsonwebtoken');
const { fetchJobs, postJobs } = require("../controller/job")
const checkAuthentication = require("../middleware/checkAuthentication");
const validateSchema = require("../middleware/validateSchema");
const { jobSchema } = require("../schema/jobSchema");




router.get("/jobs", fetchJobs)
router.post("/jobs", validateSchema(jobSchema) ,checkAuthentication(process.env.JWT_SECRET_KEY_EMP), postJobs)

module.exports = router