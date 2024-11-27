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

// Update the `isRead` field for a single message
const updateMessageReadStatus = asyncHandle(async (req, res) => {
    const { messageId } = req.params;
    const { isRead } = req.body;

    try {
        const updatedMessage = await MessageModel.findByIdAndUpdate(
            messageId,
            { isRead },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error updating message read status:", error);
        res.status(500).json({ message: "Error updating message read status", error });
    }
});


const markMessagesAsReadByChatId = asyncHandle(async (req, res) => {
    const { chatId } = req.params;

    try {
        const updatedMessages = await MessageModel.updateMany(
            { chatId, isRead: false }, // Find unread messages
            { isRead: true }           // Mark as read
        );

        res.status(200).json({
            message: "Messages marked as read",
            updatedCount: updatedMessages.modifiedCount,
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Error marking messages as read", error });
    }
});

const countMessageNotification = asyncHandle(async (req, res) => {
    const { chatId, userId } = req.params;
    try {
        const countIsReadTrue = await MessageModel.countDocuments({
            chatId: chatId,
            isRead: true,
            senderId: { $ne: userId }, // Điều kiện: senderId khác userId
        });
        res.status(200).json({
            chatId,
            isReadTrueCount: countIsReadTrue,
        });
    } catch (error) {
        console.error("Error counting messages:", error);
        res.status(500).json({ message: "Lỗi khi đếm thông báo", error });
    }
});

const updateIsReadToFalse = asyncHandle(async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.updateMany(
            { chatId: chatId,isRead: true  },
            { isRead: false }
        );

        res.status(200).json({
            message: "Cập nhật thành công",
            modifiedCount: result.modifiedCount, // Số bản ghi đã cập nhật
        });
    } catch (error) {
        console.error("Error updating messages:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật trạng thái isRead",
            error,
        });
    }
});
module.exports = {createMessage, getMessage, updateMessageReadStatus, markMessagesAsReadByChatId,countMessageNotification,updateIsReadToFalse}