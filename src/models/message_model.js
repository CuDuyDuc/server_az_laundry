const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String,
    isRead:{ type: Boolean, default: true } 
}, {
    timestamps: true
})

const MessageModel = mongoose.model("message", MessageSchema)

module.exports = MessageModel