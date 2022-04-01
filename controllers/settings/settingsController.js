const SettingsModel = require("../../models/SettingsModel");
const settingsCollection = require("../../db").db().collection("settings");

module.exports = {
  settingsPanel: async (req, res) => {
    res.render("admin/settings", {
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
    });
  },
  settingsPost: async (req, res) => {
    const settings = new SettingsModel(req.body, req.file);
    settings
      .editSettings()
      .then(async () => {
        res.redirect("/admin");
      })
      .catch(() => {
        res.send("404");
      });
  },
};
