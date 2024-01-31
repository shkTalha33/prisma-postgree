const prisma = require("../db.config");
const { BadRequestException, ServerError } = require("../libs/errorExceotionSchema");
const errorMessages = require("../libs/errorMessages");
const { onSuccess } = require("../libs/resoonseWrapper");

exports.createPost = async (req, res,next) => {

 const user_id = req.user

  const {  title, description } = req.body;


  const newPost = await prisma.post.create({
    data: {
      user_id,
      title,
      description,
    },
  });

  if (!newPost) {
    return next(
      new ServerError(
        errorMessages.INTERNAL_SERVER_ERROR
      )
    )
  }

  return res.status(200).json(onSuccess(200,newPost));
};

exports.updatePost = async (req, res,next) => {
  const postId = req.params.id;
  const user_id = req.user
  const {  title, description } = req.body;
  const updatedPost = await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: { user_id, title, description },
  });

  if (!updatedPost) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_POST
      )
    )
  }

  res.status(200).json(onSuccess(200,updatedPost));
};

exports.getAllPosts = async (req, res,next) => {

  let limit = Number(req.query.limit) || 2
  let page = Number(req.query.page) || 1

  if (page <= 0) {
     page = 1
  }

  if (limit <=0 || limit >= 100) {
     limit = 10
  }

const skip = (page - 1) * limit

  const getAllPosts = await prisma.post.findMany({
    skip:skip,
    take:limit,
    include: {
      comment: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy:{
      id:"desc"
    },
  // where:{
  //   NOT:[
  //     {
  //       title:{
  //         startsWith:"N"
  //       }
  //     },
  //     {
  //       title:{
  //         endsWith:"js "
  //       }
  //     },
  //   ]
  // }
  });

  if (!getAllPosts) {
    return next(
      new ServerError(
        errorMessages.INTERNAL_SERVER_ERROR
      )
    )
  }

  const totalPosts = await prisma.post.count()

  if (!totalPosts) {
    return next(
      new ServerError(
        errorMessages.INTERNAL_SERVER_ERROR
      )
    )
  }

  const totalPages = Math.ceil(totalPosts /limit)

  const data = {
    ...getAllPosts,
    totalPosts,
    totalPages,
    currentPage:page,
    limit:limit
  }

  res.status(200).json(onSuccess(200,data));
};
exports.getPost = async (req, res,next) => {
  const postId = req.params.id;
  const getPost = await prisma.post.findFirst({
    where: {
      id: Number(postId),
    },
  });

  if (!getPost) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_POST
      )
    )
  }

  res.status(200).json(onSuccess(200,getPost));
};
exports.deletePost = async (req, res,next) => {
  const postId = req.params.id;

  const post = await prisma.user.findFirst({
    where:{
      id:Number(postId),
    }
  })
  
  if (!post) {
    return next(
      new BadRequestException(
        errorMessages.DO_NOT_FOUND_POST
      )
    )
  }

  const deletePost = await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });


  res.status(200).json(onSuccess(200,deletePost));
};

exports.searchPost = async(req,res,next) => {
  const  query = req.query.q
  const searchedPost = await prisma.post.findMany({
     where:{
      description:{
          contains:query
      }
     }
  })

  res.status(200).json(onSuccess(200,searchedPost))
}

