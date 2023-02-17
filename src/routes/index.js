var express = require("express");
const router = express.Router();

var postsController = require("../controller/post");

router.get("/api/posts", postsController.get);
// http://localhost:5000/api/posts
module.exports = router;
