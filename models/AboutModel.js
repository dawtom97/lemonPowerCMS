const aboutCollection = require("../db").db().collection("about");

class AboutModel {
    constructor(about) {
       this.about = about
    }
    create() {
       return new Promise(async(resolve,reject)=>{
         //  await aboutCollection.insertOne(this.about)
           await aboutCollection.updateOne({}, {$set: {
               heading: this.about.heading, 
               shortDesc: this.about.shortDesc,
               editor: this.about.editor
           }})
           resolve()
       })
    }
}

module.exports = AboutModel