const prisma = require("../db.config")
const { BadRequestException, ServerError } = require("../libs/errorExceotionSchema")
const errorMessages = require("../libs/errorMessages")
const { onSuccess } = require("../libs/resoonseWrapper")

exports.createComment = async(req,res) =>{

    const user_id = req.user

    const {post_id,comment} = req.body

    
   const updateComment = await prisma.post.update({
        where:{
           id:Number(post_id)
        },
        data:{
           comment_count:{
               increment:1
           }
        }
   })

   if (!updateComment) {
     return next(
        new BadRequestException(
            errorMessages.DO_NOT_FOUND_COMMENT
        )
     )
   }

    const newComment = await prisma.comment.create({
        data:{
            user_id,post_id,comment
        }
    })

    if (!newComment) {
       return next(
        new ServerError(
            errorMessages.SOMETHING_WENT_WRONG_COMMENT_CREATED_PROCESS
        )
       )
    }

   return res.status(200).json(onSuccess(200,newComment))

}  
exports.updateComment = async(req,res) =>{

    const user_id = req.user

    const commentId = req.params.id
    const {post_id,comment} = req.body

    const isComment = await prisma.comment.findFirst({
        where:{
            id: commentId
        }
    })

    if (!isComment) {
        return next(
            new BadRequestException(
                errorMessages.DO_NOT_FOUND_COMMENT
            )
        )
    }

    const updatedComment = await prisma.comment.update({
        where:{
            id:commentId
        },
        data:{
            user_id,
            post_id,
            comment
        }
    })


  return  res.status(200).json(onSuccess(200,updatedComment))

}  
exports.getAllComments = async(req,res,next) =>{


    const getAllComments = await prisma.comment.findMany({})

    if (!getAllComments) {
        return next(
            new ServerError(
                errorMessages.SOMETHING_WENT_WRONG_FETCHING_ALL_COMMENTS_PROCESS
            )
        )
    }

   return res.status(200).json(onSuccess(200,getAllComments))

}  
exports.getComment = async(req,res,next) =>{

    const commentId = req.params.id

    const getComment = await prisma.comment.findFirst({
        where:{
            id: commentId
        }
    })

    if (!getComment) {
        return next(
            new BadRequestException(
                errorMessages.DO_NOT_FOUND_COMMENT
            )
        )
    }


    res.status(200).json(onSuccess(200,getComment))

}  
exports.deleteComment = async(req,res,next) =>{

    const commentId = req.params.id

    const isComment = await prisma.comment.findFirst({
        where:{
            id: commentId
        }
    })

    if (!isComment) {
        return next(
            new BadRequestException(
                errorMessages.DO_NOT_FOUND_COMMENT
            )
        )
    }
    
    const deleteComment = await prisma.comment.delete({
        where:{
            id:commentId
        },
        
    })
    await prisma.post.update({
         where:{
            id:Number(deleteComment.post_id)
         },
         data:{
            comment_count:{
                decrement:1
            }
         }
    })

    if (!deleteComment) {
        return next(
            new BadRequestException(
                errorMessages.SOMETHING_WENT_WRONG_COMMENT_DELETING_PROCESS
            )
        )
    }

    res.status(200).json(onSuccess(200,deleteComment))

}  


