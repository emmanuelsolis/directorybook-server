const { Schema, model } = require("mongoose");


const contactSchema =  new Schema(
    {
        contactName: { type: String},
        contactLastName: { type: String},
        contactEmail:{type: String},
        contactPhoneNumber: {type: String},
        contactAddress: {type: String},
        contactImageUrl: {type:String},
        contactCompany:{type: String},
    },
    {
     timestamps:true
    },

)

const Contact = model("Contact", contactSchema)

module.exports = Contact