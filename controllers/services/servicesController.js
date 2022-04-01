const { ObjectId } = require("mongodb");
const ServiceModel = require("../../models/ServiceModel");
const serviceCategoryCollection = require("../../db")
  .db()
  .collection("services-category");
const serviceCollection = require("../../db").db().collection("services");
const settingsCollection = require("../../db").db().collection("settings");

module.exports = {
  servicesPanel: async (req, res) => {
    res.render("admin/services", {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
      services: await serviceCollection
        .aggregate([
          {
            $lookup: {
              from: "services-category",
              localField: "categoryId",
              foreignField: "_id",
              as: "service",
            },
          },
        ])
        .toArray(),
    });
  },
  servicesCreateCategory: async (req, res) => {
    res.render("admin/services-create-category", {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
    });
  },
  servicesCreateCategoryPost: (req, res) => {
    const service = new ServiceModel(req.body);
    service
      .create()
      .then(async () => {
        res.redirect("/admin/services");
      })
      .catch(() => {
        res.send("404");
      });
  },
  servicesCreate: async (req, res) => {
    res.render("admin/services-create", {
      breadcrumbs: req.breadcrumbs,
      settings: await settingsCollection.findOne(),
      categories: await serviceCategoryCollection.find().toArray(),
    });
  },
  servicesCreatePost: (req, res) => {
    const service = new ServiceModel(req.body);
    service
      .createService()
      .then(async () => {
        res.redirect("/admin/services");
      })
      .catch(() => {
        res.send("404");
      });
  },
  servicesDelete: async (req, res) => {
    await serviceCollection.deleteOne({ _id: ObjectId(req.params.id) });
    res.redirect("/admin/services");
  },
  servicesEdit: async (req, res) => {
    res.render("admin/services-edit", {
      breadcrumbs: req.breadcrumbs,
      settings: await settingsCollection.findOne(),
      categories: await serviceCategoryCollection.find().toArray(),
      service: await serviceCollection.findOne({
        _id: ObjectId(req.params.id),
      }),
    });
  },
  servicesEditPost: (req, res) => {
    const service = new ServiceModel(req.body, req.params.id);
    service
      .editService()
      .then(async () => {
        res.redirect("/admin/services");
      })
      .catch(() => {
        res.send("404");
      });
  },
};
