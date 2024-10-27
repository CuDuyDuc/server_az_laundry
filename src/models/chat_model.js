const { default: mongoose } = require("mongoose");


const ChatSchema = new mongoose.Schema({
    members: Array
}, {
    timestamps: true
})

const ChatModel = mongoose.model('chat', ChatSchema)

module.exports = ChatModel