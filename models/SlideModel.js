const ObjectId = require("mongodb").ObjectId;
const slidesCollection = require("../db").db().collection("slides");

class SlideModel {
    constructor (slide,photo,id) {
       this.slide = slide;
       this.photo = photo
       this.id = id;
    }
    add() {
       return new Promise(async(resolve,reject)=> {
           this.slide = {
               slideId: ObjectId(this.slide.slideId),
               photo: this.photo,
               title: this.slide.title, 
               description: this.slide.description,
               link: this.slide.link
           }
           await slidesCollection.insertOne(this.slide);
           resolve();
       })
    }
    photoUpdate() {
        return new Promise(async(resolve,reject) => {
            await slidesCollection.updateOne({_id:ObjectId(this.id)}, {
                $set: {
                    photo: this.photo
                }
            })
            resolve()
        })
    }
    editSlide() {
        return new Promise(async(resolve,reject) => {
            await slidesCollection.updateOne({_id:ObjectId(this.id)}, {
                $set: {
                    slideId: ObjectId(this.slide.slideId),
                    title: this.slide.title, 
                    description: this.slide.description,
                    link: this.slide.link
                }
            })
            resolve()
        })
    }
}


module.exports = SlideModel;