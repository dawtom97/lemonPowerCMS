const UserModel = require("../../models/UserModel");
const settingsCollection = require("../../db").db().collection("settings");
const userCollection = require("../../db").db().collection("users");
const postCollection = require("../../db").db().collection("posts");
const blogCollection = require("../../db").db().collection("blogs");
const categoryCollection = require("../../db").db().collection("categories");
const serviceCollection = require("../../db").db().collection("services");

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
  dashboard: async (req, res) => {
    res.render("admin/index", {
      settings: await settingsCollection.findOne(),
      posts: await postCollection.find().toArray(),
      blogs: await blogCollection.find().toArray(),
      categories: await categoryCollection.find().toArray(),
      services: await serviceCollection.find().toArray(),
      breadcrumbs: req.breadcrumbs ? req.breadcrumbs : req.breadcrumbs[0],
      latestPosts: await postCollection.find({}).sort({$natural:-1}).limit(5).toArray(),
      lastCategory: await categoryCollection.find({}).sort({$natural:-1}).limit(1).toArray(),
      lastService: await serviceCollection.find({}).sort({$natural:-1}).limit(1).toArray(),
      latestBlogs: await blogCollection.find({}).sort({$natural:-1}).limit(5).toArray(),
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
  retrieveUser: async (req, res) => {
    let user = new UserModel(req.body);
    const userLogged = await userCollection.findOne();
    user
      .retrieve()
      .then(() => {
        req.session.user = {
          email: user.data.email,
          firstname: userLogged.firstname,
          lastname: userLogged.lastname,
        };
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
      //   console.log(req.session.user)
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
  getBreadcrumbs(req, res, next) {
    const urls = req.originalUrl.split("/");
    urls.shift();
    req.breadcrumbs = urls.map((url, i) => {
      return {
        breadcrumbName:
          url === "" ? "Home" : url.charAt(0).toUpperCase() + url.slice(1),
        breadcrumbUrl: `/${urls.slice(0, i + 1).join("/")}`,
      };
    });
    console.log(req.breadcrumbs);
    next();
  },
};
