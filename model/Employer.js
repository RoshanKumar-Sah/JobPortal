const mongoose = require("mongoose")
require("mongoose-type-url")
require("mongoose-type-email")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmployerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        // type: String,
        required: true,
        validate: {
            validator: async function (enterd_email) {
                let exist_email = await mongoose.models.Employer.findOne({ email: enterd_email })
                if (exist_email) {
                    return false
                }
            },
            message: props => `An account with this email address ${props.value} already exists`
        }
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    website: {
        type: mongoose.SchemaTypes.Url,
        // required: true
        // type: String
    },
    description: {
        type: String,
        maxLength: 500
    }
});

module.exports = mongoose.model("Employer", EmployerSchema)