const Router = require("express")
const { createMessage, getMessage, updateIsReadToFalse, countMessageNotifications } = require("../controllers/message_controller")
const multer = require('multer');

const MessageRouter = Router()
const upload = multer({ storage: multer.memoryStorage() });

MessageRouter.post('/create-message',upload.single("image_messages"), createMessage)
MessageRouter.get('/get-message/:chatId', getMessage)
MessageRouter.post('/get-count-isread/', countMessageNotifications)
MessageRouter.put('/update-count-isread/:chatId', updateIsReadToFalse)

module.exports = MessageRouter