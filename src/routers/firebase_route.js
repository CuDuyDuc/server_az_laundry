const Router = require('express');

const {sendFirebaseNotification, addNotificationToken } = require('../controllers/firebase_notification_controller');


const FirebaseRouter = Router();

FirebaseRouter.post('/send-notification', async function(req, res) {
  const result = await sendFirebaseNotification(req, res);
  res.send(result);
});
// Route để thêm FCM Token và User ID
FirebaseRouter.post('/add-token', addNotificationToken);

module.exports = FirebaseRouter;
