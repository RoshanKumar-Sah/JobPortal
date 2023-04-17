const express = require("express")
const router = express.Router()
const Joi = require('joi');
const { signupEmployer, loginEmployer, signupClient, loginClient } = require("../controller/auth")
const validateSchema = require("../middleware/validateSchema")
const {empSignupSchema, loginSchema, clientSignupSchema} = require("../schema/authSchema")




router.post("/signupEmployer", validateSchema(empSignupSchema), signupEmployer)
router.post("/loginEmployer", validateSchema(loginSchema) , loginEmployer)
router.post("/signupClient",validateSchema(clientSignupSchema), signupClient)
router.post("/loginClient", validateSchema(loginSchema) , loginClient)

module.exports = router