const { ObjectId } = require("mongodb");
const CategoryModel = require("../../models/CategoryModel");
const categoryCollection = require("../../db").db().collection("categories");
const settingsCollection = require("../../db").db().collection("settings");

module.exports = {
  categories: async (req, res) => {
    res.render("admin/category", {
      categories: await categoryCollection.find().toArray(),
      userEmail: req.session.user.email,
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
    });
  },
  categoriesCreate: async (req, res) => {
    res.render("admin/create-category", {
      logs: req.flash("create_errors"),
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
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
      .then(async (result) => {
        res.render("admin/edit-category", {
          category: result,
          settings: await settingsCollection.findOne(),
          breadcrumbs: req.breadcrumbs,
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
};