const express = require("express")
const checkAuthentication = require("../middleware/checkAuthentication")
const { apply_jobs, client_fetch_jobs, emp_fetch_jobs } = require("../controller/applied_job")
const router = express.Router()

router.post("/apply_job/:id", checkAuthentication(process.env.JWT_SECRET_KEY_CLIENT), apply_jobs)
router.get("/client/apply_job", checkAuthentication(process.env.JWT_SECRET_KEY_CLIENT), client_fetch_jobs)
router.get("/emp/apply_job", checkAuthentication(process.env.JWT_SECRET_KEY_EMP), emp_fetch_jobs)

module.exports = router