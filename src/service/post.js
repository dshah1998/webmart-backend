var postDatabase = require("../database/post");

class postService {
  get() {
    return postDatabase.get();
  }
}
module.exports = new postService();
