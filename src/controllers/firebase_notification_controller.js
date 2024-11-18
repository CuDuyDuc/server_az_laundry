const NotificationService = require("../services/NotificationService");
const Notification = require("../models/notification_model");
const User = require("../models/user_model"); 
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');

const sendFirebaseNotification = asyncHandler(async (req, res) => {
  const { userId, sender, title, body, shortDescription, notification_type, object_type_id } = req.body;

  // Tạo một bản ghi thông báo mới trong MongoDB
  const newNotification = new Notification({
    recipient: userId,
    sender,
    notification_type,
    title,
    body,
    object_type_id,
    shortDescription,
    status: "unread",
  });

  // Lưu thông báo vào cơ sở dữ liệu
  await newNotification.save();

  // Tìm fcmToken của người nhận trong User model
  const recipientUser = await User.findById(userId);
  console.log(recipientUser);
  
  // Gửi thông báo qua Firebase nếu user có fcmToken
  if (recipientUser && recipientUser.device_token) {
    try {
      console.log({ userId, sender, title, body, deviceToken: recipientUser.device_token });

      // Gửi thông báo qua Firebase với deviceToken
      const result = await NotificationService.sendNotification(
        recipientUser.device_token,
        title,
        body
      );
      console.log({ result });

      res.status(200).json({ message: "Notification sent successfully via Firebase and saved in DB", success: true });
    } catch (error) {
      console.error("Failed to send Firebase notification:", error);
      res.status(500).json({ message: "Notification saved in DB, but failed to send Firebase notification.", success: false });
    }
  } else {
    console.warn(`User ${userId} does not have an fcmToken, skipping Firebase notification.`);
    res.status(200).json({ message: "Notification saved in DB, but Firebase notification was not sent (no fcmToken).", success: true });
  }
});

module.exports = { sendFirebaseNotification };
