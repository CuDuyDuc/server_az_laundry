const NotificationService = require("../services/NotificationService");
const Notification = require("../models/notification_model");
const NotificationDetailsModel = require("../models/notification_details_model");
const asyncHandler = require("express-async-handler");

const sendFirebaseNotification = asyncHandler(async (req, res) => {
  const { userId, title, body, deviceToken } = req.body;
  console.log({ userId, title, body, deviceToken });

  const result = await NotificationService.sendNotification(
    deviceToken,
    title,
    body
  );
  console.log({ result });

  const newNotificationDetail = new NotificationDetailsModel({
    userId,
    title,
    message: body,
    imageUrl: "",
    notiStatus: "unread",
  });

  const savedDetail = await newNotificationDetail.save();
  console.log({ savedDetail });

  // Cập nhật hoặc tạo mới thông báo
  let notification = await Notification.findOne({ userId });

  if (notification) {
    // Nếu đã có bản ghi, cập nhật danh sách notificationDetails
    notification.notificationDetails.push(savedDetail._id);
  } else {
    // Tạo mới nếu chưa có bản ghi cho user
    notification = new Notification({
      userId,
      fcmToken: deviceToken,
      notificationDetails: [savedDetail._id], // Thêm thông tin chi tiết
    });
  }

  // Lưu cập nhật vào DB
  await notification.save();

  res
    .status(200)
    .json({ message: "Notification sent successfully", success: true });
});

const addNotificationToken = asyncHandler(async (req, res) => {
  const { userId, fcmToken } = req.body;

  if (!userId || !fcmToken) {
    return res.status(400).json({
      status: 400,
      message: "Thiếu thông tin userId hoặc fcmToken",
    });
  }

  // Tạo mới hoặc cập nhật token
  let notification = await Notification.findOne({ userId });

  if (notification) {
    // Cập nhật token nếu đã tồn tại
    notification.fcmToken = fcmToken;
    await notification.save();
  } else {
    // Tạo mới nếu chưa tồn tại
    notification = new Notification({ userId, fcmToken });
    await notification.save();
  }

  res.json({
    status: 200,
    message: "FCM Token đã được thêm thành công",
    data: notification,
  });
});

module.exports = { addNotificationToken, sendFirebaseNotification };
