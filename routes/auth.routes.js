const router = require("express").Router();
const { signUpProcess, loginProcess, getUserLogged, logoutProcess} = require("../controllers/auth.controller")
const {verifyToken} = require("../middleware/jsontoken-mid");

router.post("/signup", signUpProcess)
router.post("/login", loginProcess)
router.post("/logout", logoutProcess)
router.get("/getUser",verifyToken, getUserLogged)

module.exports = router;
