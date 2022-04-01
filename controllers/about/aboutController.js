const AboutModel = require("../../models/AboutModel");
const aboutCollection = require("../../db").db().collection("about");
const settingsCollection = require("../../db").db().collection("settings");

module.exports = {
  aboutPanel: async (req,res) => {
    res.render('admin/about', {
      about: await aboutCollection.findOne(),
      settings: await settingsCollection.findOne(),
      breadcrumbs: req.breadcrumbs,
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
};
