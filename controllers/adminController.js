const { ObjectId } = require("mongodb");
const CategoryModel = require("../models/CategoryModel");
const UserModel = require("../models/UserModel");
const userCollection = require("../db").db().collection("users");
const categoryCollection = require('../db').db().collection('categories')

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

  categories: async (req,res) => {
    res.render('admin/category', {
      categories: await categoryCollection.find().toArray(),
      userEmail: req.session.user.email,
    })
  },
  categoriesCreate: (req,res) => {
    res.render('admin/create-category', {
      logs: req.flash('create_errors')
    })
  },
  categoriesCreatePost: (req,res) => {
    let category = new CategoryModel(req.body)
    category.add().then(()=>{
      res.redirect('/admin/categories')
    }).catch(()=>{
      req.flash('create_errors', 'Someting went wrong')
      req.session.save(()=>{
        res.redirect('/admin/category/create')
      })
    })
  },
  categoriesEdit: (req,res) => {
    let category = new CategoryModel(req.body, req.params.id) 
    category.edit().then((result)=>{
      res.render('admin/edit-category',{
        category: result
      })
    }).catch((err) => {
      console.log(err)
      res.send('404 errors')
    })
  },
  categoriesPostEdit: (req,res) => {
    let category = new CategoryModel(req.body, req.params.id) 
    category.editPost().then(()=>{
      res.redirect('/admin/categories')
    }).catch(()=>{
      res.redirect('/admin/categories/' + req.params.id+'/edit')
    })
  },
  categoriesDelete: async (req,res) => {
    await categoryCollection.deleteOne({_id: ObjectId(req.params.id)});
    res.redirect('/admin/categories');
  },


  //   Dashboard pages
  tasksPanel: (req, res) => {
    res.render("admin/tasks", {
      userEmail: req.session.user.email,
    });
  },
};
