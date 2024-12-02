const { admin } = require('../configs/firebase.config')
class NotificationService {
    static async sendNotification(deviceToken, title, body) {
      const message = {
        notification: {
          title,
          body,
        },
        token: deviceToken,
      };
  
      try {
        const response = await admin.messaging().send(message);
        console.log('Notification sent successfully', response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  
    static async sendEachForMulticast(fcmTokens, title, body) {
      const message = {
        notification: {
          title,
          body,
        },
        tokens: fcmTokens,
      };
  
      try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Multicast notifications sent successfully', response);
        return response;
      } catch (error) {
        console.error('Error sending multicast notifications:', error);
        throw error;
      }
    }
  }
  
  module.exports = NotificationService;
  