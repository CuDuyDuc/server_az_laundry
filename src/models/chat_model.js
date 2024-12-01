const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: Array, 
    senderCounts: [
      {
        senderId: String, 
        countIsRead: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("chat", ChatSchema);

module.exports = ChatModel;
