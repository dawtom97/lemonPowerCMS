const serviceCategoryCollection = require("../db")
  .db()
  .collection("services-category");
const serviceCollection = require("../db").db().collection("services");

const ObjectId = require("mongodb").ObjectID;

class ServiceModel {
  constructor(service) {
    this.service = service;
  }
  create() {
    return new Promise(async (resolve, reject) => {
      this.service = {
        name: this.service.name,
      };
      await serviceCategoryCollection.insertOne(this.service);
      resolve();
    });
  }
  createService() {
    return new Promise(async (resolve, reject) => {
      this.service = {
        categoryId: ObjectId(this.service.categoryId),
        name: this.service.name,
      };
      await serviceCollection.insertOne(this.service);
      resolve();
    });
  }
}

module.exports = ServiceModel;
