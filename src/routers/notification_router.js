const Router = require('express');

const { getNotificationDetailsByUserId, deleteNotificationDetailById, getUnreadNotificationCount, markNotificationAsRead } = require('../controllers/notification_details_controller');
var NotificationRouter = Router();

NotificationRouter.get('/get-alls', getNotificationDetailsByUserId);
NotificationRouter.get('/get-count-unread', getUnreadNotificationCount);
NotificationRouter.delete('/delete', deleteNotificationDetailById);
NotificationRouter.patch('/update-mark-read', markNotificationAsRead);

module.exports = NotificationRouter;
