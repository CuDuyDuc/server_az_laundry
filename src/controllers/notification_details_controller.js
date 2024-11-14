
const Notification = require('../models/notification_model');
const asyncHandler = require('express-async-handler');
const NotificationDetailsModel = require('../models/notification_details_model');
const { default: mongoose } = require("mongoose"); 
const getNotificationDetailsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Tìm notification dựa trên userId
  const notification = await Notification.findOne({ userId:  new mongoose.Types.ObjectId(userId) }).populate('notificationDetails');

  if (!notifications || notifications.length === 0) {
    return res.status(404).json({
      status: 404,
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

  // Tìm notification theo userId
  const notification = await Notification.findOne({ userId:  new mongoose.Types.ObjectId(userId) });

  if (!notification) {
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

const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Tìm thông báo dựa trên userId và kiểm tra xem có thông báo nào chưa đọc không
  const notification = await Notification.findOne({ userId:  new mongoose.Types.ObjectId(userId) }).populate({
    path: 'notificationDetails',
    match: { notiStatus: 'unread' }  // Chỉ lấy các thông báo có status là "unread"
  });

  if (!notification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo cho userId này',
    });
  }

  // Đếm số lượng thông báo chưa đọc
  const unreadCount = notification.notificationDetails.length;

  res.json({
    status: 200,
    message: 'Số lượng thông báo chưa đọc',
    data: unreadCount,
  });
});


const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { userId, notificationDetailsId } = req.body;

  // Tìm và cập nhật trạng thái thông báo thành "read" dựa trên userId và notificationDetailsId
  const updatedNotification = await NotificationDetailsModel.findOneAndUpdate(
    { _id: notificationDetailsId, userId:  new mongoose.Types.ObjectId(userId) },
    { notiStatus: 'read' },
    { new: true } 
  );

  if (!updatedNotification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo để cập nhật cho userId này',
    });
  }

  res.json({
    status: 200,
    message: 'Cập nhật trạng thái thông báo thành "read" thành công',
    data: updatedNotification,
  });
});
module.exports = {
  deleteNotificationDetailById,
  getNotificationDetailsByUserId,
  getUnreadNotificationCount,
  markNotificationAsRead
};
