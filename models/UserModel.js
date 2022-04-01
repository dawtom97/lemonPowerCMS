const userCollection = require("../db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

class UserModel {
  constructor(data) {
    this.data = data;
    this.errors = [];
    this.currentDate = new Date();
  }
  retrieve() {
    return new Promise(async (resolve, reject) => {
      this.data = {
        email: this.data.email,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        password: this.data.password,
      };
      const getUser = await userCollection.findOne();
      if (this.errors.length) {
        reject(this.errors);
      } else {
        if (
          this.data.email === getUser.email &&
          bcrypt.compareSync(this.data.password, getUser.password)
        ) {
          resolve();
        } else {
          reject('Invalid email or password');
        }
      }
    });
  }

  cleanUp() {
    !this.data.email && this.errors.push("You must provide email");
    !this.data.password && this.errors.push("You must provide password");
    !validator.isEmail(this.data.email) && this.errors.push("Email not valid");
  }

  validate() {
    !this.data.firstname && this.errors.push("You must provide firstname");
    !this.data.lastname && this.errors.push("You must provide lastname");
    !this.data.email && this.errors.push("You must provide email");
    this.data.password && this.data.password.length > 8
      ? null
      : this.errors.push("Your password should had at least 8 chars");
    this.data.confirm_password !== this.data.password &&
      this.errors.push("Passwords do not match");

    !validator.isEmail(this.data.email) && this.errors.push("Email not valid");
    validator.isNumeric(this.data.firstname) &&
      this.errors.push("First name should not have numbers");
    validator.isNumeric(this.data.lastname) &&
      this.errors.push("Last name should not have numbers");
  }
  add() {
    return new Promise(async (resolve, reject) => {
      this.validate();
      if (this.errors.length) reject(this.errors);
      else {
        this.data = {
          firstname: this.data.firstname,
          lastname: this.data.lastname,
          email: this.data.email,
          password: bcrypt.hashSync(this.data.password, bcrypt.genSaltSync(10)),
          createDate: this.currentDate.toString().slice(0, 24),
          updateDate: this.currentDate.toString().slice(0, 24),
        };
        await userCollection.insertOne(this.data);
        resolve();
      }
    });
  }
}

module.exports = UserModel;
