const { ObjectId } = require("mongodb");
const BlogModel = require("../../models/BlogModel");
const categoryCollection = require("../../db").db().collection("categories");
const blogCollection = require("../../db").db().collection("blogs");
const settingsCollection = require("../../db").db().collection("settings");

module.exports = {
  blogPanel: async (req,res) => {
    res.render('admin/blog', {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      blogs: await blogCollection.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        }
      ]).toArray()
    })
  },

  blogCreate: async (req,res) => {
    res.render('admin/blog-create', {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      categories: await categoryCollection.find().toArray()
    })
  },
  blogCreatePost: async (req,res) => {
    const blog = new BlogModel(req.body,req.file);
    blog.create()
    .then(async()=>{
      res.redirect('/admin/blog')
    })
    .catch(()=>{
      res.send('404')
    })
  },
  blogDelete: async (req,res) => {
     await blogCollection.deleteOne({_id: ObjectId(req.params.id)})
     res.redirect("/admin/blog")
  },
  blogEditCover: async (req,res) => {
    res.render("admin/blog-edit-cover", {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      blog: await blogCollection.findOne({_id: ObjectId(req.params.id)})
    })
  },
  blogEditCoverPost: (req,res) => {
    const blog = new BlogModel(req.body, req.file, req.params.id);
    blog.coverUpdate()
    .then(async()=>{
      res.redirect('/admin/blog')
    }).catch(()=>{
      res.send('404')
    })
  },
  blogEdit: async (req,res) => {
    res.render("admin/blog-edit", {
      settings: await settingsCollection.findOne(),
      blog: await blogCollection.findOne({_id: ObjectId(req.params.id)}),
      categories: await categoryCollection.find().toArray(),
      breadcrumbs: req.breadcrumbs,
    })
  },
  blogEditPost: async (req,res) => {
     const blog = new BlogModel(req.body, req.file, req.params.id)
     blog.editBlog()
     .then(async()=>{
       res.redirect('/admin/blog')
     })
     .catch(()=>{
       res.send('404')
     })
  },
};
