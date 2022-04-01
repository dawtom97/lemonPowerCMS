const { ObjectId } = require("mongodb");
const PostModel = require("../../models/PostModel");
const categoryCollection = require("../../db").db().collection("categories");
const postCollection = require("../../db").db().collection("posts");
const settingsCollection = require("../../db").db().collection("settings");


module.exports = {
  posts: async (req, res) => {
    res.render("admin/posts", {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      posts: await postCollection.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        }
      ]).toArray()
    });
  },
  postsCreate: async (req, res) => {
    res.render("admin/posts-create", {
      categories: await categoryCollection.find().toArray(),
      breadcrumbs: req.breadcrumbs,
      settings: await settingsCollection.findOne(),
    });
  },
  postsCreatePost: (req, res) => {
    const createPost = new PostModel(req.body, req.files);
    createPost
      .add()
      .then(() => {
        res.redirect("/admin/posts");
      })
      .catch(() => {
        res.send("404");
      });
  },
  postsEdit:(req,res) => {
    const editPost = new PostModel(req.body,req.files,req.params.id);
    editPost
    .edit()
    .then(async (result) => {
      res.render("admin/posts-edit", {
        settings: await settingsCollection.findOne(),
        breadcrumbs: req.breadcrumbs,
        categories: await categoryCollection.find().toArray(),
        post: result
      });
    })
    .catch(() => {
      res.send('/admin/posts/'+req.params.id+'/edit');
    });
  },
  postsEditPost: (req,res) => {
    const editPost = new PostModel(req.body,req.files,req.params.id);
    editPost
    .editPost()
    .then(async () => {
      res.redirect('/admin/posts');
    })
    .catch(() => {
      res.redirect('/admin/posts/'+req.params.id+'/edit');
    });
  },

  postsEditCover: async (req,res) => {
    res.render('admin/edit-cover', {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      post: await postCollection.findOne({_id: ObjectId(req.params.id)})
    })
  },
  postsEditCoverPost: (req,res) => {
   const upload = new PostModel(req.body, req.files, req.params.id) 
   console.log(req.files)
   upload.up().then(()=>{
     res.redirect("/admin/posts")
   })
   .catch(()=>{
     res.send('404')
   })
  },

  postsDelete: async (req,res) => {
     await postCollection.deleteOne({_id: ObjectId(req.params.id)})
     res.redirect("/admin/posts")
  },
};
