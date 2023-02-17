var PostSchema = require("../model/post");

class postDatabase {
  get() {
    // return new Promise((resolve, reject) => {
    //     try {
    //         PostSchema.find({}, (error, data) => {
    //             if (error) {
    //                 errors["002"].reason = error.message || "";
    //                 reject(errors["002"]);
    //             } else {
    //                 resolve(data);
    //             }
    //         })
    //     } catch (error) {
    //         errors["003"].reason = error.message;
    //         reject(errors["003"]);
    //     }
    // })
    return "abc12";
  }
}

module.exports = new postDatabase();
