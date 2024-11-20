const { default: mongoose } = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  notification_type: {
    type: String,
    enum: ['order_update', 'promotion', 'reminder', 'product'], 
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  body: {
    type: String,
    default: null,
  },
  object_type_id: {
    type: String,
    default: null, 
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  shortDescription: {  
    type: String,
    default: null,
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

const NotificationModel = mongoose.model('notification', NotificationSchema);
module.exports = NotificationModel;

