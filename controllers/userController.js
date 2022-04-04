const settingsCollection = require("../db").db().collection("settings");
const userCollection = require("../db").db().collection("users");
const postCollection = require("../db").db().collection("posts");
const blogCollection = require("../db").db().collection("blogs");
const categoryCollection = require("../db").db().collection("categories");
const serviceCategoryCollection = require("../db")
  .db()
  .collection("services-category");
const aboutCollection = require("../db").db().collection("about");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const MessageModel = require("../models/MessageModel");

module.exports = {
  index: async (req, res) => {
    res.render("user/index", {
      settings: await settingsCollection.findOne(),
      categories: await categoryCollection.find().toArray(),
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
    });
  },
  blog: async (req, res) => {
    res.render("user/blog", {
      settings: await settingsCollection.findOne(),
      categories: await categoryCollection.find().toArray(),
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
    });
  },
  about: async (req, res) => {
    res.render("user/about", {
      settings: await settingsCollection.findOne(),
      about: await aboutCollection.findOne(),
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
  getContact: async (req,res) => {
    res.render("user/contact", {
      settings: await settingsCollection.findOne(),
      errors: req.flash("errors"),
      success: req.flash("success")
    });
  },

  contact: async (req, res) => {

    const GMAIL_PASS = process.env.GMAIL_PASS
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
    message.add().then(()=>console.log("Wiadomość wysłana"))


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
        console.log(error)
        req.flash('errors', 'someting went wrong');
        req.session.save(()=>{
          res.redirect('/contact')
        })
      } else {
        req.flash("success", "Message send ")
        req.session.save(()=>{
          res.redirect('/contact')
        })
      }
    });
  },
};

// POST route from contact form

// Instantiate the SMTP server
