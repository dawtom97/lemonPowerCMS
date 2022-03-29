const serviceCategoryCollection = require("../db")
  .db()
  .collection("services-category");
const serviceCollection = require("../db").db().collection("services");

const ObjectId = require("mongodb").ObjectID;

class ServiceModel {
  constructor(service,id) {
    this.service = service;
    this.id = id;
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
  editService() {
    return new Promise(async (resolve,reject) => {
      await serviceCollection.updateOne({_id: ObjectId(this.id)}, {$set: {
        categoryId: ObjectId(this.service.categoryId),
        name: this.service.name,
      }})
      resolve()
    })
  }
}

module.exports = ServiceModel;
