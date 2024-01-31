const express = require("express")
const router = express.Router()
const userController = require("../controllers/userContoller")
const { duplicateEmail, duplicateName } = require("../middleware/validation")
const { signUpValidations, signInValidations } = require("../middleware/check")

router.post("/signup",[duplicateEmail,duplicateName,signUpValidations],userController.signUp)
router.post("/signin",[signInValidations],userController.signIn)
router.put("/updateuser/:id",userController.updateData)
router.get("/getusers",userController.getAllUsers)
router.get("/getuser/:id",userController.getUser)
router.delete("/deleteuser/:id",userController.deleteUser)

module.exports = router