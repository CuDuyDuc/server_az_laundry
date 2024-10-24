const { default: mongoose } = require("mongoose");


const Notification_Schame = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  fcmToken: {
    type: String,
    required: true,
  },
  notificationDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notification_details', // Tham chiếu đến NotificationDetails
    },
  ],
});


const NotificationModel = mongoose.model('notification', Notification_Schame);

module.exports = NotificationModel;


// DATA STRUCT
// {
//   "notifications": {
//     "userID_123": {
//       "fcmToken": "fcm_token_abc",
//       "notificationDetails": [
//         {
//           "id": "notif_001",
//           "title": "Bạn có 1 đơn hàng mới",
//           "body": "Đơn hàng của bạn đã được xác nhận",
//           "imageURL": "https://image-url.png",
//           "timestamp": "2024-10-04T10:00:00Z",
//           "status": "unread"
//         },
//         {
//           "id": "notif_002",
//           "title": "Giao hàng thành công",
//           "body": "Đơn hàng đã được giao đến bạn",
//           "imageURL": "https://image-url2.png",
//           "timestamp": "2024-10-04T12:00:00Z",
//           "status": "read"
//         }
//       ]
//     }
//   }
// }