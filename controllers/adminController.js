const { ObjectId } = require("mongodb");
const AboutModel = require("../models/AboutModel");
const BlogModel = require("../models/BlogModel");
const CategoryModel = require("../models/CategoryModel");
const PostModel = require("../models/PostModel");
const ServiceModel = require("../models/ServiceModel");
const UserModel = require("../models/UserModel");
const userCollection = require("../db").db().collection("users");
const categoryCollection = require("../db").db().collection("categories");
const postCollection = require("../db").db().collection("posts");
const aboutCollection = require("../db").db().collection("about");
const serviceCategoryCollection = require("../db")
  .db()
  .collection("services-category");
const serviceCollection = require("../db").db().collection("services");
const blogCollection = require("../db").db().collection("blogs");


module.exports = {
  register: (req, res) => {
    res.render("admin/register", {
      errors: req.flash("regError"),
    });
  },
  login: (req, res) => {
    res.render("admin/login", {
      errors: req.flash("loginError"),
      middleError: req.flash("middleError"),
    });
  },
  dashboard: (req, res) => {
    res.render("admin/index", {
      userEmail: req.session.user.email,
    });
  },
  createUser: (req, res) => {
    let user = new UserModel(req.body);
    user
      .add()
      .then(() => {
        res.redirect("/admin/login");
      })
      .catch((err) => {
        req.flash("regError", err);
        req.session.save(() => {
          res.redirect("/admin/register");
        });
      });
  },
  retrieveUser: (req, res) => {
    let user = new UserModel(req.body);
    user
      .retrieve()
      .then(() => {
        req.session.user = { email: user.data.email };
        req.session.save(() => {
          res.redirect("/admin");
        });
      })
      .catch((err) => {
        req.flash("loginError", err);
        req.session.save(() => {
          res.redirect("/admin/login");
        });
      });
  },
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/admin/login");
    });
  },

  isAlreadyAuth: (req, res, next) => {
    if (req.session.user) {
      res.redirect("/admin");
    } else {
      next();
    }
  },

  isAuthenticated: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      req.flash("middleError", "Sorry, but you do not have access");
      req.session.save(() => {
        res.redirect("/admin/login");
      });
    }
  },

  isUserCheck: async (req, res, next) => {
    const user = await userCollection.findOne();
    if (!user) {
      res.redirect("/admin/register");
    } else {
      req.flash("middleError", "Sorry but there is already a user");
      req.session.save(() => {
        res.redirect("/admin/login");
      });
    }
  },

  //categories

  categories: async (req, res) => {
    res.render("admin/category", {
      categories: await categoryCollection.find().toArray(),
      userEmail: req.session.user.email,
    });
  },
  categoriesCreate: (req, res) => {
    res.render("admin/create-category", {
      logs: req.flash("create_errors"),
    });
  },
  categoriesCreatePost: (req, res) => {
    let category = new CategoryModel(req.body);
    category
      .add()
      .then(() => {
        res.redirect("/admin/categories");
      })
      .catch(() => {
        req.flash("create_errors", "Someting went wrong");
        req.session.save(() => {
          res.redirect("/admin/category/create");
        });
      });
  },
  categoriesEdit: (req, res) => {
    let category = new CategoryModel(req.body, req.params.id);
    category
      .edit()
      .then((result) => {
        res.render("admin/edit-category", {
          category: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("404 errors");
      });
  },
  categoriesPostEdit: (req, res) => {
    let category = new CategoryModel(req.body, req.params.id);
    category
      .editPost()
      .then(() => {
        res.redirect("/admin/categories");
      })
      .catch(() => {
        res.redirect("/admin/categories/" + req.params.id + "/edit");
      });
  },
  categoriesDelete: async (req, res) => {
    await categoryCollection.deleteOne({ _id: ObjectId(req.params.id) });
    res.redirect("/admin/categories");
  },

  posts: async (req, res) => {
    res.render("admin/posts", {
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


  //   Dashboard pages
  aboutPanel: async (req,res) => {
    res.render('admin/about', {
      about: await aboutCollection.findOne()
    })
  },
  aboutPanelPost: (req,res) => {
    const about = new AboutModel(req.body)
    about.create()
    .then( async ()=>{
      res.redirect('/admin/about')
    })
    .catch(()=>{
      res.send('404')
    })
  },
  servicesPanel: async (req,res) => {
      res.render('admin/services', {
        services: await serviceCollection.aggregate([
          {
            $lookup: {
              from: "services-category",
              localField:  'categoryId',
              foreignField: "_id",
              as: "service"
            }
          }
        ]).toArray()
      })
  },
  servicesCreateCategory: (req,res) => {
      res.render('admin/services-create-category')
  },
  servicesCreateCategoryPost: (req,res) => {
      const service = new ServiceModel(req.body) 
      service.create().then(async() => {
        res.redirect("/admin/services")
      })
      .catch(()=>{
        res.send('404')
      })
  },
  servicesCreate: async (req,res) => {
    res.render('admin/services-create', {
      categories: await serviceCategoryCollection.find().toArray()
    })
  },
  servicesCreatePost: (req,res) => {
    const service = new ServiceModel(req.body) 
    service.createService().then(async() => {
      res.redirect("/admin/services")
    })
    .catch(()=>{
      res.send('404')
    })
  },
  servicesDelete: async (req,res) => {
    await serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    res.redirect("/admin/services")
  },

  // BLOG
  blogPanel: async (req,res) => {
    res.render('admin/blog', {
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
      blog: await blogCollection.findOne({_id: ObjectId(req.params.id)}),
      categories: await categoryCollection.find().toArray()
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
  }
  
};
