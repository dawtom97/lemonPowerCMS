const postCollection = require("../db").db().collection("posts");
const ObjectId = require("mongodb").ObjectID;

class PostModel {
  constructor(post, images, id) {
    this.post = post;
    this.images = images;
    this.id = id;
    this.currentDate = new Date();
  }

  add() {
    return new Promise(async (resolve, reject) => {
      this.post = {
        categoryId: ObjectId(this.post.categoryId),
        title: this.post.title,
        editor: this.post.editor,
        images: this.images,
        createDate: this.currentDate.toString().slice(0, 24),
        updateDate: this.currentDate.toString().slice(0, 24),
      };
      await postCollection.insertOne(this.post);
      resolve();
    });
  }

  edit() {
    return new Promise(async (resolve, reject) => {
      const editPost = await postCollection.findOne({ _id: ObjectId(this.id) });
      if (editPost) {
        resolve(editPost);
      } else {
        reject("Not found");
      }
    });
  }

  editPost() {
    return new Promise(async (resolve, reject) => {
      await postCollection.updateOne(
        { _id: ObjectId(this.id) },
        {
          $set: {
            categoryId: ObjectId(this.post.categoryId),
            title: this.post.title,
            editor: this.post.editor,
          },
        }
      );
      resolve();
    });
  }

  up() {
    return new Promise(async (resolve, reject) => {
      await postCollection.updateOne(
        { _id: ObjectId(this.id) },
        {
          $set: {
            images: this.images,
          },
        }
      );
      resolve();
    });
  }
}

module.exports = PostModel;
