const mongoose = require("mongoose")


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const convertCase = (value) =>{
    return value.toLowerCase()
}

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        enum: ["frontend", "backend", "full-stack", "graphics-designer", "uiux-designer"],
        set: convertCase,
        required: true
        
    },
    job_level:{
        type: [String],
        enum: ["fresher", "junior", "mid", "senior"],
        set: convertCase,
        required: true
    },
    number_of_vacancy: {
        type: Number,
        min:0,
        default:0
    },
    location: {
        type: String,
        required: true
    },
    offered_salary: {
        type: Number,
        min:0,
        default:0
    },
    deadline: {
        type: Date,
        required: true
    },
    type: {
        type: [String],
        enum: ["top", "hot", "featured", "normal"],
        set: convertCase,
        default: "normal"
    },
    // created_at: {
    //     type: Date,
    //     required: true
    // },
    created_by: {
        type: ObjectId,
        ref: "Employer",
        required: true
    },
    description: {
        type: String

    },
    profile_image: {
        type: String
    },
    cover_image: {
        type: String
    }
},
{
timestamps: true,
});

module.exports = mongoose.model("Job", JobSchema)