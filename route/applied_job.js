const express = require("express")
const checkAuthentication = require("../middleware/checkAuthentication")
const {apply_jobs} = require("../controller/applied_job")
const router = express.Router()

router.post("/apply_job/:id", checkAuthentication(process.env.JWT_SECRET_KEY_CLIENT), apply_jobs)

module.exports = router