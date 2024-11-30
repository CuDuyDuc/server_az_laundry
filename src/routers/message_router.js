const Router = require("express")
const { createMessage, getMessage, updateIsReadToFalse, countMessageNotifications } = require("../controllers/message_controller")

const MessageRouter = Router()

MessageRouter.post('/create-message', createMessage)
MessageRouter.get('/get-message/:chatId', getMessage)
MessageRouter.post('/get-count-isread/', countMessageNotifications)
MessageRouter.put('/update-count-isread/:chatId', updateIsReadToFalse)

module.exports = MessageRouter