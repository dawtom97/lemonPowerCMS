const categoryCollection = require("../db").db().collection("categories");
const ObjectId = require("mongodb").ObjectID;

class CategoryModel {
  constructor(category, categoryId) {
    this.category = category;
    this.errors = [];
    this.categoryId = categoryId;
  }
  validate() {
    this.category.name == "" &&
      this.errors.push("Category name field should not be empty");
    this.category.slug == "" &&
      this.errors.push("Slug name field should not be empty");
  }
  add() {
    return new Promise(async (resolve, reject) => {
      this.validate();
      if (this.errors.length) {
        reject(this.errors);
      } else {
        this.category = {
          name: this.category.name,
          slug: this.category.slug,
        };
        await categoryCollection.insertOne(this.category);
        resolve();
      }
    });
  }
  edit () {
      return new Promise(async(resolve,reject) => {
          let findById = await categoryCollection.findOne({_id:ObjectId(this.categoryId)})
          if(findById) {
              resolve(findById)
          } else {
              reject("There is no object id specified")
          }
      })
  }

  editPost() {
      return new Promise(async(resolve,reject) => {
          await categoryCollection.updateOne({_id: ObjectId(this.categoryId)}, {$set: {
              name: this.category.name,
              slug: this.category.slug
          }
        })
        resolve()
      })
  }
}

module.exports = CategoryModel;
