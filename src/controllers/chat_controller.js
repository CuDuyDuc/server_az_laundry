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


const updateIsReadCount = asyncHandle(async (req, res) => {
    const { chatId, userId } = req.body; // Nhận dữ liệu từ request body

    // Ép kiểu userId thành chuỗi
    const userIdString = String(userId);

    try {
        // Tìm chat bằng chatId
        const chat = await ChatModel.findById(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Cập nhật countIsRead cho các senderCount không phải là userId
        const updatedSenderCounts = chat.senderCounts.map(senderCount => {
            if (senderCount.senderId !== userIdString) {
                senderCount.countIsRead = 0;
            }
            return senderCount;
        });

        // Cập nhật lại mảng senderCounts
        chat.senderCounts = updatedSenderCounts;

        // Lưu thay đổi
        await chat.save();

        // Tìm lại chat đã cập nhật và trả về tất cả dữ liệu
        const updatedChat = await ChatModel.find({
            members: {$in: [userId]}
        })
        
        // Trả về toàn bộ dữ liệu của chat (tương tự GET)
        res.status(200).json({
            message:'success',
            data:updatedChat
        });
    } catch (error) {
        console.error("Error updating countIsRead:", error);
        res.status(500).json({ message: "Error updating countIsRead", error });
    }
});


module.exports = {createChat, findUserChat, findChat,updateIsReadCount};