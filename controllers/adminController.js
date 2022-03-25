const UserModel = require("../models/UserModel");
const userCollection = require("../db").db().collection("users");

module.exports = {
  register: (req, res) => {
    res.render("admin/register", {
        errors: req.flash('regError')
    });
  },
  login: (req, res) => {
    res.render("admin/login", {
       errors: req.flash('loginError'),
       middleError: req.flash('middleError')
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
        req.flash('regError', err);
        req.session.save(()=>{
            res.redirect('/admin/register')
        })
      });
  },
  retrieveUser: (req,res) => {
     let user = new UserModel(req.body)
     user.retrieve()
     .then(()=>{
         req.session.user = {email: user.data.email}
         req.session.save(()=>{
            res.redirect('/admin')
         })
     })
     .catch((err) => {
         req.flash('loginError', err)
         req.session.save(()=>{
            res.redirect('/admin/login')
         })
     })
  },
  logout: (req,res) => {
      req.session.destroy(()=>{
         res.redirect('/admin/login')
      });
  },

  isAlreadyAuth: (req,res,next) => {
     if(req.session.user) {
         res.redirect('/admin')
     } else {
         next()
     }
  },

  isAuthenticated: (req,res,next) => {
      if(req.session.user){
          next()
      } else {
          req.flash("middleError", "Sorry, but you do not have access");
          req.session.save(()=>{
              res.redirect('/admin/login')
          })
      }
  },

  isUserCheck: async (req,res, next) => {
     const user = await userCollection.findOne();
     if(!user) {
         res.redirect('/admin/register')
     } else {
         req.flash('middleError', 'Sorry but there is already a user')
         req.session.save(()=>{
            res.redirect('/admin/login')
         })
     }
  }
};
