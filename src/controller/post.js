var postService = require("../service/post");

class postsController {
  get(request, response) {
    console.log("Inside Post Controller");
    const ans = postService.get();
    response.status(200).send(ans);
  }
}

module.exports = new postsController();
