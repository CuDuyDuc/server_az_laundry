
const Notification = require('../models/notification_model');
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require("mongoose"); 
const getNotificationsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Tìm tất cả thông báo dựa trên userId
  const notifications = await Notification.find({ recipient: new mongoose.Types.ObjectId(userId) })
  .sort({ createdAt: -1 });

  if (!notifications || notifications.length === 0) {
    return res.json({
      message: 'Không tìm thấy thông báo cho userId này',
    });
  }

  // Trả về danh sách các thông báo
  res.json({
    status: 200,
    message: 'Danh sách thông báo',
    data: notifications,
  });
});
const deleteNotificationById = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;

  // Xóa thông báo theo ID
  const deletedNotification = await Notification.findByIdAndDelete(notificationId);

  if (!deletedNotification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo để xóa',
    });
  }

  res.json({
    status: 200,
    message: 'Xóa thành công thông báo',
  });
});

const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Đếm số lượng thông báo chưa đọc cho user
  const unreadCount = await Notification.countDocuments({
    recipient: new mongoose.Types.ObjectId(userId),
    status: 'unread',
  });

  res.json({
    status: 200,
    message: 'Số lượng thông báo chưa đọc',
    data: unreadCount,
  });
});


const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;

  // Tìm và cập nhật trạng thái thông báo thành "read" dựa trên notificationId
  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    { status: 'read' },
    { new: true }
  );

  if (!updatedNotification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo để cập nhật',
    });
  }

  res.json({
    status: 200,
    message: 'Cập nhật trạng thái thông báo thành "read" thành công',
    data: updatedNotification,
  });
});

module.exports = {
  deleteNotificationById,
  getNotificationsByUserId,
  getUnreadNotificationCount,
  markNotificationAsRead
};
