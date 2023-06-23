const { date } = require("joi");
const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const Applied_JobSchema = new Schema({
    job: {
        type: ObjectId,
        ref: "Job",
        required: true
    },

    client: {
        type: ObjectId,
        ref: "Client",
        required: true
    },

    applied_date: {
        type: Date,
        required: true

    }

})

module.exports = mongoose.model("Applied_Job", Applied_JobSchema)