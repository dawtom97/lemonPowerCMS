const settingsCollection = require("../db").db().collection("settings");
const ObjectId = require("mongodb").ObjectID;

class SettingsModel {
  constructor(settings, logo) {
    this.settings = settings;
    this.logo = logo;
  }
  editSettings() {
    return new Promise(async (resolve, reject) => {
      this.settings = {
        logo: this.logo,
        instagram: this.settings.instagram,
        facebook: this.settings.facebook,
        address1: this.settings.address1,
        address2: this.settings.address2,
        phone: this.settings.phone,
        email: this.settings.email,
        footer: this.settings.footer,
        blogLimit: this.settings.blogLimit
      };
    //check that item in collection exist
      console.log(this.logo)
      settingsCollection.count(async (err,count) => {
        if (!err && count == "0") {
          await settingsCollection.insertOne(this.settings);
        } else {
          await settingsCollection.updateOne(
            {},
            {
              $set: {
                logo: this.logo,
                instagram: this.settings.instagram,
                facebook: this.settings.facebook,
                address1: this.settings.address1,
                address2: this.settings.address2,
                phone: this.settings.phone,
                email: this.settings.email,
                footer: this.settings.footer,
                blogLimit: this.settings.blogLimit
              },
            }
          );
        }
      });
      resolve();
    });
  }
}

module.exports = SettingsModel;
