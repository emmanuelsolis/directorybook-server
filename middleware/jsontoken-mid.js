const jwt = require("jsonwebtoken")
const User = require("../models/User.model")



// Middleware

/*
* Este nos va a servir para verificar si tengo un usuario loggeado
* */
exports.verifyToken = (req,res,next) => {
    console.log("las cookies", req.cookies)
    const { headload, signature } = req.cookies
    if(!headload || !signature) return res.status(401).json({errorMessage: "Unauthorized cookie"})
        //732726347.123123.423e3e3d3e, Perrro182, (error,{emai:"",_id:"",perro:"No"}

    jwt.verify(`${headload}.${signature}`,process.env.SUPER_SECRET, {complete:true},(err, decoded) =>{
        //esto es cuando tiene error en la verificacion
        if(err){
            return res.status(401).json({errorMessage: "Unauthorized"})
        }
        console.log("que carahooo es el decoded??", decoded)
        User.findById(decoded.userId)
            .then(user => {
                req.user = user // aqui guardo mi ususario loggeado en el req para usarlo en los otros endpoints o middlewares
                next()// nos da el paso para la siguiente accion || ruta
            })
            .catch(error => {
                res.status(401).json({errorMessage: "Algo salio mal checar consola",error})
            })
    })  //  < ---- aca termina verify

} // <---- aca termina funcion padre verifyToken


exports.createJWT = (user)=> {
    return jwt.sign({
        userId: user._id,
        email: user.username,
    }, process.env.SUPER_SECRET, {expiresIn:'24h'}).split('.')
}

exports.clearRes = (data) => {
    const { password, __v, updatedAt, ...cleanedData } = data
    return cleanedData
}
//node sin babel
//module.exports = {verifyToken, otrafuncion}

//node con babel
//export funcion
//import funciont from "../..."