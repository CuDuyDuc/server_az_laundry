const NotificationService = require("../services/NotificationService");
const Notification = require("../models/notification_model");
const User = require("../models/user_model"); 
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const PaymentModel = require("../models/payment_model");

const sendFirebaseNotification = asyncHandler(async (req, res) => {
  const { userId, sender, title, body, shortDescription, notification_type, object_type_id } = req.body;

  let recipientUserId = null;
  let recipientUser = null;
  let senderId = null;
  try {
    if (notification_type === 'order_update' && !userId) {
    
      const payment = await PaymentModel.findById(object_type_id).populate({
        path: 'id_cart',
        populate: { path: 'id_product', select: 'id_user' },
      });

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.', success: false });
      }

      const cart = payment?.id_cart[0];
      const product = cart?.id_product;

      if (!product?.id_user) {
        return res.status(404).json({ message: 'Product or shop not found.', success: false });
      }
      
      recipientUserId = product?.id_user;
    } else if(notification_type === 'order_update' && userId) {
      const payment = await PaymentModel.findById(object_type_id).populate({
        path: 'id_cart',
        populate: { path: 'id_product', select: 'id_user' },
      });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.', success: false });
      }
      const cart = payment?.id_cart[0];
      const product = cart?.id_product;
      if (!product?.id_user) {
        return res.status(404).json({ message: 'Product or shop not found.', success: false });
      }
      senderId = product?.id_user;
      recipientUserId = userId;
    } else {
      recipientUserId = userId;
    }

  
    recipientUser = await User.findById(recipientUserId);

    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient user not found.', success: false });
    }

    // Tạo thông báo trong DB
    const newNotification = new Notification({
      recipient: recipientUserId,
      sender : senderId ?  senderId : sender,
      notification_type,
      title,
      body,
      object_type_id,
      shortDescription,
      status: "unread",
    });

    await newNotification.save();

    // Gửi thông báo qua Firebase nếu có `device_token`
    if (recipientUser.device_token) {
      const result = await NotificationService.sendNotification(
        recipientUser.device_token,
        title,
        body
      );

      return res.status(200).json({
        message: "Notification sent successfully via Firebase and saved in DB",
        success: true,
      });
    }

    console.warn(`User ${recipientUserId} does not have an fcmToken, skipping Firebase notification.`);
    return res.status(200).json({
      message: "Notification saved in DB, but Firebase notification was not sent (no fcmToken).",
      success: true,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    
  }
});

module.exports = { sendFirebaseNotification };
