const Router = require('express');

const { getNotificationDetailsByUserId, deleteNotificationDetailById } = require('../controllers/notification_details_controller');
var NotificationRouter = Router();

NotificationRouter.get('/get-alls', getNotificationDetailsByUserId);
NotificationRouter.delete('/delete', deleteNotificationDetailById);

module.exports = NotificationRouter;
