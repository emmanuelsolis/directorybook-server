const Contact = require("../models/Contact.model")


exports.getAllContacts = async (req, res, next)=> {
    try{
        const contacts = await  Contact.find()
        res.status(201).json({contacts})
    }catch(error){
        //handle error man!!
        console.log(error)
    }
}

exports.createContact = async (req, res,) => {
    try{
        const {name,lastName, email, phone, address, image, company} = req.body
        const contact = await Contact.create({
            contactName:name,
            contactLastName: lastName,
            contactEmail:email,
            contactPhoneNumber:phone,
            contactAddress:address,
            contactImageUrl: image,
            contactCompany:company
        })
        res.status(201).json(contact)
    }catch(error){
        console.log(error)
    }
}

exports.getContactById = async (req, res) => {
    try{
        const { id } = req.params
        const oneContact = await Contact.findById(id)
        res.status(302).json(oneContact)
    }catch(error){
        console.log(error)
    }
}

exports.editContact =  async (req, res) => {
    try{
        const { id } = req.params
        const {name,lastName, email, phone, address, image, company} = req.body
        const oneContact = await Contact.findByIdAndUpdate(id,{
            contactName:name,
            contactLastName: lastName,
            contactEmail:email,
            contactPhoneNumber:phone,
            contactAddress:address,
            contactImageUrl: image,
            contactCompany:company
        },{new:true})
        res.status(302).json({oneContact})
    }catch(error){
        console.log(error)
    }
}

exports.deleteContact = async (req, res) => {
    try{
        const { id } = req.params
        const deletedContact = await Contact.findByIdAndDelete(id)
        res.status(301).json({message: "Contact deleted successfully"})
    }catch(error){
 console.log(error)
    }

}

//module.exports = { getAllContacts }