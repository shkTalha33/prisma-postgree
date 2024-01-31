const prisma = require("../db.config")
const { BadRequestException, UnauthorizedAccess } = require("../libs/errorExceotionSchema")
const errorMessages = require("../libs/errorMessages")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.duplicateEmail = async(req,res,next) => {
    const {email} = req.body
    const isEmailExist = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if (isEmailExist) {
        return next(new BadRequestException(
            errorMessages.EMAIL_ALREADY_EXIST
        ))
    }
  next()

}

exports.duplicateName = async(req,res,next) => {
    const {name} = req.body
    const isNameExist = await prisma.user.findFirst({
        where:{
            name:name
        }
    })

    if (isNameExist) {
        return next(new BadRequestException(
            errorMessages.NAME_ALREADY_EXIST
        ))
    }
  next()

}


exports.checkAuth = async (req,res,next) => {
    const access_token = req.headers.authorization
    if (!access_token) {
        return next(
            new UnauthorizedAccess(
                errorMessages.UNAUTHORIZED_ACCESS
            )
        )
    }
    const verifyToken = jwt.verify(access_token,process.env.JWT_SECRET)

    const userId = verifyToken.user.id

    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })

    if (!user) {
        return next(
            new UnauthorizedAccess(
                errorMessages.UNAUTHORIZED_ACCESS
            )
        )
    }
    
    req.user = user.id
     next()
}

