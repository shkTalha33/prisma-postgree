const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const { checkAuth } = require("../middleware/validation")

router.post("/createpost",[checkAuth],postController.createPost)
router.get("/searchpost",postController.searchPost)
router.put("/updatepost/:id",[checkAuth],postController.updatePost)
router.get("/getallposts",postController.getAllPosts)
router.get("/getpost/:id",postController.getPost)
router.delete("/deletepost/:id",postController.deletePost)

module.exports = router