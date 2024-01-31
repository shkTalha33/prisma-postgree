const { check } = require("express-validator");

exports.signUpValidations = [
    check("name").notEmpty().withMessage("Name cannot be empty")
    .isLength({min:3}).withMessage("Name should have atleast 3 letters"),
    check("email").notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Email is not valid"),
    check("password").notEmpty().withMessage("Password cannot be empty")
    .isLength({min:6}).withMessage("Password should be atleast 6 characters long")

]

exports.signInValidations = [
    check("email").notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Email is not valid"),
    check("password").notEmpty().withMessage("Password cannot be empty")
]