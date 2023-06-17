const Joi = require("joi")

const empSignupSchema = Joi.object({

    name: Joi.string()
        .max(100)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

    password: Joi.string()
        .required(),
    //.pattern(/^[a-zA-Z0-9`~!@#$%^&*]{8,64}$/)

    contact: Joi.string()
        .required(),

    website: Joi.string().allow(null,''),

    description: Joi.string().allow(null,'')
})

const loginSchema = Joi.object({

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

    password: Joi.string()
        .required()
    //.pattern(/^[a-zA-Z0-9`~!@#$%^&*]{8,64}$/)
})

const clientSignupSchema = Joi.object({

    name: Joi.string()
        .max(100)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

    password: Joi.string()
        .required(),
    //.pattern(/^[a-zA-Z0-9`~!@#$%^&*]{8,64}$/)

    phone: Joi.number()
        .integer()
        .min(1000000000)
        .max(9999999999)
        .required()
})




module.exports = {
    empSignupSchema,
    loginSchema,
    clientSignupSchema
}