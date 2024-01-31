const express = require("express")
const { createComment, deleteComment, getAllComments, getComment, updateComment } = require("../controllers/commentController")
const { checkAuth } = require("../middleware/validation")
const router = express.Router()

router.post("/createcomment",[checkAuth],createComment)
router.delete("/deletecomment/:id",deleteComment)
router.get("/getallcomments",getAllComments)
router.get("/getcomment/:id",getComment)
router.put("/updatecomment/:id",[checkAuth],updateComment)

module.exports = router
