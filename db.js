const mongodb = require("mongodb").MongoClient;
const dotenv = require('dotenv').config();

mongodb.connect(
  process.env.CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) console.log(err);
    module.exports = client;
    const app = require("./app");
    app.listen(process.env.PORT, (req, res) => {
      console.log("connected");
    });
  }
);
