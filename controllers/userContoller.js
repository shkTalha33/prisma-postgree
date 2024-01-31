const { validationResult } = require("express-validator");
const prisma = require("../db.config");
const { BadRequestException } = require("../libs/errorExceotionSchema");
const errorMessages = require("../libs/errorMessages");
const { onSuccess } = require("../libs/resoonseWrapper");
const bycrypt = require("bcryptjs")
require("dotenv").config()
const jwt = require("jsonwebtoken")

exports.signUp = async (req, res,next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new BadRequestException(
      errors.errors[0].msg
    ))
  }

  const { name, email, password } = req.body;

  const salt = await bycrypt.genSalt(10)
  
  const hasPassword = await bycrypt.hash(password,salt)

 
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password:hasPassword,
    },
  });

  if (!newUser) {
    return next(
      new BadRequestException(
        errorMessages.SOMETHING_WENT_WRONG_USER_CREATED_PROCESS
      )
    )
  }
  return res.status(200).json(onSuccess(200,newUser));
};
exports.signIn = async (req, res,next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
     return next(
      new BadRequestException(
        errors.errors[0].msg
      )
     )
  }

  const { email, password } = req.body;


  const user = await prisma.user.findUnique({
     where:{
      email:email
     }
  });

  if (!user) {
    return next(
      new BadRequestException(
        errorMessages.EMAIL_NOT_FOUND
      )
    )
  }

  const verifyPassword = await bycrypt.compare(password,user.password)

  if (!verifyPassword) {
     return next(
      new BadRequestException(
        errorMessages.PASSWORD_NOT_CORRECT
      )
     )
  }

  console.log(user.id)

  const data = {
   user:{
    id:user.id
   }
  }

  const token = jwt.sign(data,process.env.JWT_SECRET,
    {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: "1h",
  }
  )

  const dataToSend = {
     name:user.name,
     createdAt:user.created_at,
     email:user.email,
     token
  }

  return res.status(200).json(onSuccess(200,dataToSend));
};


exports.updateData = async (req, res,next) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const user = await prisma.user.findFirst({
    where:{
      id:Number(userId)
    }
  })

  if (!user) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_USER
      )
    );
  }

  const updateUser = await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      name,
      email,
      password,
    },
  });

 

 return res.status(200).json( onSuccess(200,updateUser));
};

exports.getAllUsers = async (req, res,next) => {
  const getAllUsers = await prisma.user.findMany({
    select: {
      _count: {
        select: {
          post: true,
          comment: true,
        },
      },
    },
  });

  if (!getAllUsers) {
    return next(
     new BadRequestException(
       errorMessages.AN_UNKNOWN_ERROR_OCCURS
     )
    )
 }

 return res.status(200).json(onSuccess(200,getAllUsers));
};
exports.getUser = async (req, res,next) => {
  const userId = req.params.id;
  const getUser = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
  });

  if (!getUser) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_USER
      )
    )
  }

  res.status(200).json(onSuccess(200,getUser));
};
exports.deleteUser = async (req, res,next) => {
  const userId = req.params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  });
  
  if (!user) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_USER
      )
    );
  }
  const deleteUser = await prisma.user.delete({
    where: {
      id: Number(userId)
    },
  });


  res.status(200).json(onSuccess(200,deleteUser));
};
