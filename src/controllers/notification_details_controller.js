const Notification = require('../models/notification_model');
const NotificationDetails = require('../models/notification_details_model');
const asyncHandler = require('express-async-handler');

const getNotificationDetailsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Tìm notification dựa trên userId
  const notification = await Notification.findOne({ userId }).populate('notification_details');

  if (!notification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo cho userId này',
    });
  }

  // Trả về danh sách notificationDetails
  res.json({
    status: 200,
    message: 'Danh sách thông báo',
    data: notification.notificationDetails,
  });
});

const deleteNotificationDetailById = asyncHandler(async (req, res) => {
  const { userId, notificationDetailsId } = req.params;

  // Tìm notification theo userId
  const notification = await Notification.findOne({ userId });

  if (!notification) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy thông báo cho userId này',
    });
  }

  // Xóa notificationDetails khỏi bảng NotificationDetails
  const deletedDetail = await NotificationDetails.findByIdAndDelete(notificationDetailsId);

  if (!deletedDetail) {
    return res.status(404).json({
      status: 404,
      message: 'Không tìm thấy chi tiết thông báo để xóa',
    });
  }

  // Cập nhật lại danh sách notificationDetails của người dùng
  notification.notificationDetails = notification.notificationDetails.filter(
    (detailId) => detailId.toString() !== notificationDetailsId
  );
  await notification.save();

  res.json({
    status: 200,
    message: 'Xóa thành công chi tiết thông báo',
  });
});

module.exports = {
  deleteNotificationDetailById,
  getNotificationDetailsByUserId,
};
