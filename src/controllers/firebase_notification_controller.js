const NotificationService = require("../services/NotificationService");
const Notification = require("../models/notification_model");
const User = require("../models/user_model"); 
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const PaymentModel = require("../models/payment_model");

const sendFirebaseNotification = asyncHandler(async (req, res) => {
  const { userId, sender, listShopId, title, body, shortDescription, notification_type, object_type_id } = req.body;

  try {
    let recipientIds = [];
    let senderId = sender;
    console.log("listShopId Line 105 : ", listShopId);
    if (Array.isArray(listShopId) && listShopId.length > 0) {
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

    const notifications = [];
    for (const recipient of recipientIds) {
      const { id, deviceToken } = recipient;

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
