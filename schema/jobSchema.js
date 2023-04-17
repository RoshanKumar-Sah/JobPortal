const Joi = require("joi")
Joi.objectId = require('joi-objectid')(Joi)

const jobSchema = Joi.object({

    title: Joi.string()
    .required(),

    category: Joi.string()
    .lowercase()
    .valid("frontend", "backend", "full-stack", "graphics-designer", "uiux-designer")
    .required(),

    job_level: Joi.string()
    .lowercase()
    .valid("fresher", "junior", "mid", "senior")
    .required(),

    number_of_vacancy: Joi.number(),

    location: Joi.string()
    .required(),

    offered_salary: Joi.number(),

    deadline: Joi.date()
    .required(),

    type: Joi.string()
    .lowercase()
    .valid("top", "hot", "featured", "normal"),

    // created_at: Joi.date()
    // .required(),

    // created_by: Joi.objectId(),
    // .required(),

    description: Joi.string()
    .allow(""),

    profile_image: Joi.string()
    .allow(""),

    cover_image: Joi.string()
    .allow(""),

})

module.exports ={
    jobSchema
}