const Router = require('express');

const { getNotificationsByUserId, deleteNotificationById, getUnreadNotificationCount, markNotificationAsRead } = require('../controllers/notification_details_controller');
var NotificationRouter = Router();

NotificationRouter.get('/get-alls', getNotificationsByUserId);
NotificationRouter.get('/get-count-unread', getUnreadNotificationCount);
NotificationRouter.delete('/delete', deleteNotificationById);
NotificationRouter.patch('/update-mark-read', markNotificationAsRead);

module.exports = NotificationRouter;
