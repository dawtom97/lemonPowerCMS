const settingsCollection = require("../db").db().collection("settings");
const userCollection = require("../db").db().collection("users");
const postCollection = require("../db").db().collection("posts");
const blogCollection = require("../db").db().collection("blogs");
const slidesCollection = require("../db").db().collection("slides");
const categoryCollection = require("../db").db().collection("categories");
const serviceCategoryCollection = require("../db")
  .db()
  .collection("services-category");
const aboutCollection = require("../db").db().collection("about");
const dotenv = require("dotenv").config();
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const MessageModel = require("../models/MessageModel");

module.exports = {
  index: async (req, res) => {
    res.render("user/index", {
      settings: await settingsCollection.findOne(),
      categories: await categoryCollection.find().toArray(),
      slides: await slidesCollection.find().toArray(),
      posts: await postCollection
        .aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
        ])
        .toArray(),
      blogs: await blogCollection.find({}).sort({$natural:-1}).limit(5).toArray(),
    });
  },
  blog: async (req, res) => {
    let { page, size } = req.params;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 3;
    }
    const limit = Number(size);
    const skip = (page - 1) * size;

    console.log(req.params);

    res.render("user/blog", {
      currentPage: Number(req.params.page),
      currentCategory: req.params.category,
      settings: await settingsCollection.findOne(),
      categories: await categoryCollection.find().toArray(),
      slides: await slidesCollection.find().toArray(),
      blogs: await blogCollection
        .aggregate([
          {
            $match: { categoryId: req.params.category !== 'all' ? ObjectId(req.params.category) : {$ne: req.params.category}}
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $sort: {
              age : -1, 
              createDate: 1
            }
          }
        ])
    
        .skip(skip)
        .limit(limit)
        .toArray(),
    });
  },
  about: async (req, res) => {
    res.render("user/about", {
      settings: await settingsCollection.findOne(),
      about: await aboutCollection.findOne(),
      slides: await slidesCollection.find().toArray(),
      categories: await serviceCategoryCollection
        .aggregate([
          {
            $lookup: {
              from: "services",
              localField: "_id",
              foreignField: "categoryId",
              as: "services",
            },
          },
        ])
        .toArray(),
    });
  },
  getContact: async (req, res) => {
    res.render("user/contact", {
      settings: await settingsCollection.findOne(),
      errors: req.flash("errors"),
      success: req.flash("success"),
    });
  },

  contact: async (req, res) => {
    const GMAIL_PASS = process.env.GMAIL_PASS;
    const smtpTrans = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let message = new MessageModel(req.body);
    message.add().then(() => console.log("Wiadomość wysłana"));

    // Specify what the email will look like
    const mailOpts = {
      from: req.body.email, // This is ignored by Gmail
      to: process.env.GMAIL_USER,
      subject: req.body.subject,
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`,
    };

    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        console.log(error);
        req.flash("errors", "someting went wrong");
        req.session.save(() => {
          res.redirect("/");
        });
      } else {
        req.flash("success", "Message send ");
        req.session.save(() => {
          res.redirect("/");
        });
      }
    });
  },
};

// POST route from contact form

// Instantiate the SMTP server
