const ObjectId = require("mongodb").ObjectId;
const SlideModel = require("../../models/SlideModel");
const settingsCollection = require("../../db").db().collection("settings");
const slidesCollection = require("../../db").db().collection("slides");

module.exports = {
    slidesPanel: async (req,res) => {
        res.render("admin/slides", {
            breadcrumbs: req.breadcrumbs,
            settings: await settingsCollection.findOne(),
            slides: await slidesCollection.find().toArray()
        })
    },
    slidesCreate: async (req,res) => {
        res.render("admin/slides-create", {
            breadcrumbs: req.breadcrumbs,
            settings: await settingsCollection.findOne(),
        })
    },
    slidesCreatePost: async (req,res) => {
        const slide = new SlideModel(req.body, req.file);
        slide.add()
        .then(async()=>{
            res.redirect('/admin/slides')
        })
        .catch(()=>{
            res.send("404");
        })
    },
    slidesDelete: async (req,res) => {
      await slidesCollection.deleteOne({_id: ObjectId(req.params.id)});
      res.redirect("/admin/slides")
    },
    slidesEditPhoto: async (req,res) => {
        res.render("admin/slide-edit-photo", {
            breadcrumbs: req.breadcrumbs,
            settings: await settingsCollection.findOne(),
            slide: await slidesCollection.findOne({_id: ObjectId(req.params.id)})
        })
    },
    slidesEditPhotoPost: async(req,res) => {
        const slide = new SlideModel(req.body, req.file, req.params.id);
        slide.photoUpdate()
        .then(async()=>{
            res.redirect("/admin/slides")
        })
        .catch(()=>{
            res.send("404")
        })
    },
    slideEdit: async (req,res) => {
        res.render("admin/slide-edit", {
            breadcrumbs: req.breadcrumbs,
            settings: await settingsCollection.findOne(),
            slide: await slidesCollection.findOne({_id:ObjectId(req.params.id)}),   
        })
    },
    slideEditPost: async (req,res) => {
        const slide = new SlideModel(req.body, req.file, req.params.id)
        slide.editSlide()
        .then(async()=>{
            res.redirect("/admin/slides")
        })
        .catch(()=>{
            res.send("404")
        })
    }
} 