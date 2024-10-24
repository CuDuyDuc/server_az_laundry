const asyncHandle = require("express-async-handler");
const MessageModel = require("../models/message_model");

const createMessage = asyncHandle(async (req, res) => {
    const {chatId, senderId, text} = req.body
    const message = new MessageModel({
        chatId,
        senderId, 
        text
    })
    try {
        const response = await message.save()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

const getMessage = asyncHandle(async(req, res) => {
    const {chatId} = req.params
    try {
        const message = await MessageModel.find({chatId})
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

module.exports = {createMessage, getMessage}