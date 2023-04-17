const mongoose = require("mongoose")
require("mongoose-type-url")
require("mongoose-type-email")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ClientSchema = new Schema({
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
                let exist_email = await mongoose.models.Client.findOne({ email: enterd_email })
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
    phone: {
        type: Number,
        min: 1000000000,
        max: 9999999999,
        required: true
    }
});

module.exports = mongoose.model("Client", ClientSchema)