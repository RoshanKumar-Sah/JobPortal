const express = require("express")
const router = express.Router()
var jwt = require('jsonwebtoken');
const { fetchJobs, postJobs, updateJobs, removeJobs, singleJob } = require("../controller/job")
const checkAuthentication = require("../middleware/checkAuthentication");
const validateSchema = require("../middleware/validateSchema");
const { jobSchema } = require("../schema/jobSchema");





router.get("/jobs", fetchJobs)
router.get("/jobs/:id", singleJob)
router.post("/jobs", validateSchema(jobSchema) , checkAuthentication(process.env.JWT_SECRET_KEY_EMP), postJobs)
router.put("/jobs/:id", validateSchema(jobSchema), checkAuthentication(process.env.JWT_SECRET_KEY_EMP), updateJobs)
router.delete("/jobs/:id", checkAuthentication(process.env.JWT_SECRET_KEY_EMP), removeJobs)

module.exports = router