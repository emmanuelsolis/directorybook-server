const router = require("express").Router();
const authRoutes = require("./auth.routes");
const contactsRoutes = require("./contacts.routes")
//upload images
const uploadCloud = require("../helpers/cloudinary")
const {uploadProcess} = require('../controllers/upload.controller')

/* GET home page */
router.get("/", (req, res, next) => {
  res.json({name:"kain", phone:"3243434353"});
});
router.post("/upload",uploadCloud.array('docs',5), uploadProcess);
router.post("/upload/single",uploadCloud.single('doc'), uploadProcess);

router.use("/auth", authRoutes);
router.use("/contact", contactsRoutes);

module.exports = router;
