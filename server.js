const express = require("express")
const cors = require("cors")
const { BadRequestException } = require("./libs/errorExceotionSchema")
const errorMessages = require("./libs/errorMessages")
const { onError } = require("./libs/resoonseWrapper")
const app = express()
require("dotenv").config()

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 8000


// Routes
app.use("/api/users",require("./routes/userRoutes"))
app.use("/api/post",require("./routes/postRoutes"))
app.use("/api/comments",require("./routes/commentRoutes"))

app.use((req,res,next)=>{
    // const  errors = new BadRequestException(
    //     errorMessages.DO_NOT_FOUND_ANY_ROUTE
    // )
    // throw errors
    return next(
        new BadRequestException(
            errorMessages.DO_NOT_FOUND_ANY_ROUTE
        )
    )
})

app.use((error,req,res,next)=>{
    if (req.headerSent) {
      return next(error)
    }
    res.status(error.statusCode || 500).json(
        onError(error.statusCode || 500,error.message || errorMessages.AN_UNKNOWN_ERROR_OCCURS)
    )
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})

