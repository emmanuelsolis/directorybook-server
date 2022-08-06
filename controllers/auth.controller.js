// Require the User model in order to interact with the database
const User = require("../models/User.model");
// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
//Jason web token
const jwt = require("jsonwebtoken")
// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;
//middleware importation
const { createJWT, clearRes } = require("../middleware/jsontoken-mid")


exports.signUpProcess = (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res
            .status(400)
            .json({ errorMessage: "Please provide your username." });
    }

    /*  if (password.length < 8) {
        return res.status(400).json({
          errorMessage: "Your password needs to be at least 8 characters long.",
        });
      }*/

    //   ! This use case is using a regular expression to control for special characters and min length

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!regex.test(password)) {
        return res.status(400).json( {
            errorMessage:
                "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
        });
    }


    // Search the database for a user with the username submitted in the form
    User.findOne({ username }).then((found) => {
        // If the user is found, send the message username is taken
        if (found) {
            return res.status(400).json({ errorMessage: "Username already taken." });
        }

        // if user is not found, create a new user - start with hashing the password
        return bcrypt
            .genSalt(saltRounds)
            .then((salt) => bcrypt.hash(password, salt))
            .then((hashedPassword) => {
                // Create a user and save it in the database
                return User.create({
                    username,
                    password: hashedPassword,
                });
            })
            .then((user) => {
                // Bind the user to the session object
                // req.session.user = user;
                // comienza el JWT journey templo de agua
                const [header, payload, signature]= createJWT(user)
                res.cookie("headload", `${header}.${payload}`,{
                    maxAge: 1000 * 60 * 30,
                    httpOnly:true,
                    sameSite:true,
                    secure:false,
                })
                res.cookie("signature", signature,{
                    httpOnly:true,
                    sameSite: true,
                    secure:false,
                })
                console.log("response con cookie + token", res.cookies)
                const newUser = clearRes(user.toObject())
                res.status(201).json({user:newUser});
            })
            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError) {
                    return res.status(400).json({ errorMessage: error.message });
                }
                if (error.code === 11000) {
                    return res.status(400).json({
                        errorMessage:
                            "Username need to be unique. The username you chose is already in use.",
                    });
                }
                return res.status(500).json({ errorMessage: error.message });
            });
    });
}
exports.loginProcess = async (req,res,next) => {
    try {
        //destructurar
        const { username, password } = req.body;
        const user = await User.findOne({username})
        if(!user){
            return res
                .status(400)
                .json({ errorMessage: "Oye tus credenciales son erroneas " })
        }
        const match = await bcrypt.compareSync(password, user.password)
        if(match){
            const [header, payload, signature] = createJWT(user)

            res.cookie("headload", `${header}.${payload}`, {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                sameSite: true,
                secure:false,
            });

            res.cookie("signature", signature, {
                httpOnly: true,
                sameSite: true,
                secure:false,
            });
            //borrar contraseña!!!
            const newUser = clearRes(user.toObject())
            res.status(200).json({ user:newUser })
        }else{
            res
                .status(400)
                .json({ errorMessage: "Oye tus credenciales son erroneas " })
        }


    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                errorMessage:
                    "mensaje de error",
            });
        }
        return res.status(500).json({ errorMessage: error.message })
    }
}
exports.logoutProcess = (req,res) => {
    res.clearCookie('headload')
    res.clearCookie("signature")
    res.status(200).json({result: "byee come back soon" })
}
exports.getUserLogged = async (req,res,next) =>{
    try{
        //
        const { _id } = req.user
        const user = await User.findById(_id)
        const newUser = clearRes(user.toObject())
        res.status(200).json({ user:newUser });
    }catch(error){
        res.status(400).json({ erroMessage: error });
    }
}