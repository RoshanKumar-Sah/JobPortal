const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Joi = require("joi")
var jwt = require('jsonwebtoken');
const Employer = require("../model/Employer")
const Client = require("../model/Client")




const signupEmployer = async (req, res, next) => {

    try {

        let encrypted_password = await bcrypt.hash(req.body.password, 10)
        let employer = await Employer.create({ ...req.body, password: encrypted_password })
        let temp = { ...employer.toObject() }
        delete temp.password

        //console.log(temp);

        res.send(temp)
    }
    catch (err) {
        next(err)
    }


}

const loginEmployer = async (req, res, next) => {



    let employer = await Employer.findOne({ email: req.body.email })
    // res.send(employer)
    // console.log(employer);

    if (employer) {
        let check_password = await bcrypt.compare(req.body.password, employer.password)
        if (check_password) {

            let temp = { ...employer.toObject() }
            delete temp.password
            let token = jwt.sign(temp, process.env.JWT_SECRET_KEY_EMP);
            return res.send({ temp, token })
        }
    }
    res.status(401).send({ msg: "Invalid Credentials" })
}


const signupClient = async (req, res, next) => {
    try {

        let encrypted_password = await bcrypt.hash(req.body.password, 10);


        let client = await Client.create({ ...req.body, password: encrypted_password })
        let temp = { ...client.toObject() }
        delete temp.password
        res.send(temp)
    } catch (err) {
        next(err)
    }

}

const loginClient = async (req, res, next) => {

    let client = await Client.findOne({ email: req.body.email })
    if (client) {
        let check_password = await bcrypt.compare(req.body.password, client.password);
        if (check_password) {
            let temp = { ...client.toObject() }
            delete temp.password

            let token = jwt.sign(temp, process.env.JWT_SECRET_KEY_CLIENT);
            return res.send({ temp, token })
        }
    }
    res.status(401).send({ msg: "Invalid Credentials" })
}




module.exports = {
    signupEmployer,
    loginEmployer,
    signupClient,
    loginClient
}