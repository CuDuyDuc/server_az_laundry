const asyncHandle = require("express-async-handler");
const MessageModel = require("../models/message_model");
const ChatModel = require("../models/chat_model");

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

const countMessageNotifications = asyncHandle(async (req, res) => {
    const { chatIds } = req.body; // Truyền mảng các chatId từ client qua body.
    console.log(chatIds);

    try {
        const result = await Promise.all(
            chatIds.map(async (chatId) => {
                // Lấy thông tin chi tiết chatId từ cơ sở dữ liệu nếu cần
                const chatDetails = await ChatModel.findById(chatId._id);

                // Đếm số lượng tin nhắn đã đọc theo senderId
                const senderCounts = await Promise.all(
                    chatDetails.members.map(async (memberId) => {
                        const countIsReadTrue = await MessageModel.countDocuments({
                            chatId: chatId._id,
                            isRead: true,
                            senderId: memberId, // Đếm số lượng tin nhắn đọc của từng senderId
                        });
                        return {
                            senderId: memberId,
                            isReadTrueCount: countIsReadTrue,
                        };
                    })
                );

                return {
                    ...chatDetails.toObject(), // Bao gồm các trường của chatId
                    senderCounts, // Thêm mảng senderCounts vào kết quả
                };
            })
        );

        res.status(200).json(result);
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
module.exports = {createMessage, getMessage, updateMessageReadStatus, markMessagesAsReadByChatId,countMessageNotifications,updateIsReadToFalse}