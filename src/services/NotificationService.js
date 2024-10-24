const { admin } = require('../configs/firebase.config')

class NotificationService {
    static async sendNotification(deviceToken, title, body) {
        const message = {
            notification: {
                title,
                body,
            },
            token: deviceToken
        }

        try {
           const response = await admin.messaging().send(message);    
           console.log(response);  
            console.log('Notification sent successfully');
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationService;