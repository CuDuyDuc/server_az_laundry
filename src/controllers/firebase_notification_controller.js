const NotificationService = require("../services/NotificationService");
const Notification = require("../models/notification_model");
const User = require("../models/user_model"); 
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const PaymentModel = require("../models/payment_model");

// const sendFirebaseNotification = asyncHandler(async (req, res) => {
//   const { userId, sender, title, body, shortDescription, notification_type, object_type_id } = req.body;

//   let recipientUserId = null;
//   let recipientUser = null;
//   let senderId = null;
//   try {
//     if (notification_type === 'order_update' && !userId) {
    
//       const payment = await PaymentModel.findById(object_type_id).populate({
//         path: 'id_cart',
//         populate: { path: 'id_product', select: 'id_user' },
//       });

//       if (!payment) {
//         return res.status(404).json({ message: 'Payment not found.', success: false });
//       }

//       const cart = payment?.id_cart[0];
//       const product = cart?.id_product;

//       if (!product?.id_user) {
//         return res.status(404).json({ message: 'Product or shop not found.', success: false });
//       }
      
//       recipientUserId = product?.id_user;
//     } else if(notification_type === 'order_update' && userId) {
//       const payment = await PaymentModel.findById(object_type_id).populate({
//         path: 'id_cart',
//         populate: { path: 'id_product', select: 'id_user' },
//       });
//       if (!payment) {
//         return res.status(404).json({ message: 'Payment not found.', success: false });
//       }
//       const cart = payment?.id_cart[0];
//       const product = cart?.id_product;
//       if (!product?.id_user) {
//         return res.status(404).json({ message: 'Product or shop not found.', success: false });
//       }
//       senderId = product?.id_user;
//       recipientUserId = userId;
//     } else {
//       recipientUserId = userId;
//     }

  
//     recipientUser = await User.findById(recipientUserId);

//     if (!recipientUser) {
//       return res.status(404).json({ message: 'Recipient user not found.', success: false });
//     }

//     // Tạo thông báo trong DB
//     const newNotification = new Notification({
//       recipient: recipientUserId,
//       sender : senderId ?  senderId : sender,
//       notification_type,
//       title,
//       body,
//       object_type_id,
//       shortDescription,
//       status: "unread",
//     });

//     await newNotification.save();

//     // Gửi thông báo qua Firebase nếu có `device_token`
//     if (recipientUser.device_token) {
//       const result = await NotificationService.sendNotification(
//         recipientUser.device_token,
//         title,
//         body
//       );

//       return res.status(200).json({
//         message: "Notification sent successfully via Firebase and saved in DB",
//         success: true,
//       });
//     }

//     console.warn(`User ${recipientUserId} does not have an fcmToken, skipping Firebase notification.`);
//     return res.status(200).json({
//       message: "Notification saved in DB, but Firebase notification was not sent (no fcmToken).",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error sending notification:", error);
    
//   }
// });

const sendFirebaseNotification = asyncHandler(async (req, res) => {
  const { userId, sender, listShopId, title, body, shortDescription, notification_type, object_type_id } = req.body;

  try {
    let recipientIds = [];
    let senderId = sender;
    console.log("listShopId Line 105 : ", listShopId);
    // Xử lý nếu có `listShopId`
    if (Array.isArray(listShopId) && listShopId.length > 0) {
      // Lấy danh sách userId (chủ shop) dựa trên listShopId
      const shopOwners = await User.find({
        _id: { $in: listShopId },
      }).select("_id device_token");
      console.log({shopOwners});
      ;
      if (!shopOwners || shopOwners.length === 0) {
        return res.status(404).json({ message: "No shop owners found for the given listShopId.", success: false });
      }

      recipientIds = shopOwners.map((shop) => ({
        id: shop._id,
        deviceToken: shop.device_token,
      }));
    } else if (userId) {
      // Nếu không có `listShopId`, sử dụng `userId`
      const user = await User.findById(userId).select("_id device_token");

      if (!user) {
        return res.status(404).json({ message: "Recipient user not found.", success: false });
      }

      recipientIds.push({
        id: user._id,
        deviceToken: user.device_token,
      });
    } else {
      return res.status(400).json({ message: "Either listShopId or userId must be provided.", success: false });
    }

    // Tạo thông báo và gửi Firebase notification cho từng recipient
    const notifications = [];
    for (const recipient of recipientIds) {
      const { id, deviceToken } = recipient;

      // Tạo bản ghi notification trong database
      const newNotification = new Notification({
        recipient: id,
        sender: senderId,
        notification_type,
        title,
        body,
        object_type_id,
        shortDescription,
        status: "unread",
      });

      await newNotification.save();
      notifications.push(newNotification);

      // Gửi notification qua Firebase
      if (deviceToken) {
        try {
          await NotificationService.sendNotification(deviceToken, title, body);
        } catch (error) {
          console.error(`Failed to send notification to user ${id}:`, error);
        }
      } else {
        console.warn(`User ${id} does not have a device token, skipping Firebase notification.`);
      }
    }

    return res.status(200).json({
      message: "Notifications saved in DB and sent via Firebase where applicable.",
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error in sendFirebaseNotification:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
});

module.exports = { sendFirebaseNotification };
