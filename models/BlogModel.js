const blogCollection = require("../db").db().collection("blogs");
const ObjectId = require("mongodb").ObjectID;

class BlogModel {
    constructor(blog,cover,id) {
          this.blog = blog;
          this.cover = cover;
          this.id = id
          this.currentDate = new Date();
    }
    create() {
        return new Promise(async(resolve,reject) =>{
            this.blog = {
                categoryId: ObjectId(this.blog.categoryId),
                title: this.blog.title,
                editor: this.blog.editor, 
                tags: this.blog.tags,
                cover: this.cover,
                createDate: this.currentDate.toString().slice(0, 24),
                updateDate: this.currentDate.toString().slice(0, 24),
            }
            await blogCollection.insertOne(this.blog)
            resolve()
        })
    }
    coverUpdate() {
        return new Promise(async(resolve,reject) => {
            await blogCollection.updateOne({_id: ObjectId(this.id)}, {
                $set: {
                    cover: this.cover,
                    updateDate: this.currentDate.toString().slice(0, 24),
                }
            })
            resolve()
        })
    }
    editBlog() {
        return new Promise(async(resolve,reject)=>{
            await blogCollection.updateOne({_id: ObjectId(this.id)}, {
                $set: {
                    categoryId: ObjectId(this.blog.categoryId),
                    title: this.blog.title,
                    editor: this.blog.editor, 
                    tags: this.blog.tags,
                    updateDate: this.currentDate.toString().slice(0, 24),
                }            
            })
            resolve()
        })
    }
}


module.exports = BlogModel;