const messagesCollection = require("../db").db().collection("messages");
const ObjectId = require("mongodb").ObjectID;

class MessageModel {
    constructor(message,id) {
        this.message = message;
        this.id = id;
        this.currentDate = new Date();
    }
    add() {
        return new Promise(async(resolve,reject) => {
            this.message = {
                messageId: ObjectId(this.message.messageId),
                name: this.message.name,
                email: this.message.email,
                subject: this.message.subject,
                message: this.message.message,
                createDate: this.currentDate.toString().slice(0, 24),
            }
            await messagesCollection.insertOne(this.message)
            resolve()
        })
    }
    showMessage() {
        return new Promise(async(resolve,reject) => {
            const show = await messagesCollection.findOne({_id: ObjectId(this.id)});
            if(show) {
                resolve(show)
            } else {
                reject("Not found")
            }
        })
    }
}


module.exports = MessageModel