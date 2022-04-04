const MessageModel = require("../../models/MessageModel");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const messagesCollection = require("../../db").db().collection("messages");
const settingsCollection = require("../../db").db().collection("settings");
const ObjectId = require("mongodb").ObjectID;

module.exports = {
    messagesPanel: async (req,res) => {
        res.render("admin/messages", {
            settings: await settingsCollection.findOne(),
            breadcrumbs: req.breadcrumbs,
            messages: await messagesCollection.find().toArray()
        })
    },
    messagesShow: async (req,res) => {
      const show = new MessageModel(req.body,req.params.id);
      show.showMessage()
      .then(async(result) => {
        res.render("admin/message-show", {
            settings: await settingsCollection.findOne(),
            breadcrumbs: req.breadcrumbs,
            message:result
          })
      })

    },
    messagesShowSend: async(req,res) => {
      const smtpTrans = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const mailOpts = {
        from: req.body.email, // This is ignored by Gmail
        to: req.body.replyEmail,
        subject: req.body.subject,
        text: `${req.body.reply}`,
      };
  
      // Attempt to send the email
      smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
          console.log(error)
          req.flash('errors', 'someting went wrong');
          req.session.save(()=>{
            res.redirect('/admin/messages')
          })
        } else {
          req.flash("success", "Message send ")
          req.session.save(()=>{
            res.redirect('/admin/messages')
          })
        }
      });
    },
    messagesDelete: async (req,res) => {
      await messagesCollection.deleteOne({_id: ObjectId(req.params.id)})
      res.redirect("/admin/messages")
   },
}