const asyncHandle = require("express-async-handler");
const ChatModel = require("../models/chat_model");

const createChat = asyncHandle(async (req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        if (chat) return res.status(200).json(chat)
        const newChat = new ChatModel({
            members: [firstId, secondId]
        })
        const response = await newChat.save()
        res.status(200).json(response)
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
});


const findUserChat = asyncHandle(async(req, res) => {
    const userId = req.params.userId
    try {
        const chats = await ChatModel.find({
            members: {$in: [userId]}
        })
        res.status(200).json(chats)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});


const findChat = asyncHandle(async(req, res) => {
    const {firstId, secondId} = req.params
    try {
        const chat = await ChatModel.find({
            members: {$all: [firstId, secondId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

module.exports = {createChat, findUserChat, findChat};