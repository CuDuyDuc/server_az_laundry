const { default: mongoose } = require("mongoose");


const NotificationDetails_Schame = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String
  },
  message: {
    type: String
  },
  notiStatus: {
  type: String
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const NotificationDetailsModel = mongoose.model('notification_details', NotificationDetails_Schame);

module.exports = NotificationDetailsModel;
