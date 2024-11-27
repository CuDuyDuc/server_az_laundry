const Router = require("express")
const { createMessage, getMessage, countMessageNotification, updateIsReadToFalse } = require("../controllers/message_controller")

const MessageRouter = Router()

MessageRouter.post('/create-message', createMessage)
MessageRouter.get('/get-message/:chatId', getMessage)
MessageRouter.get('/get-count-isread/:chatId/:userId', countMessageNotification)
MessageRouter.put('/update-count-isread/:chatId', updateIsReadToFalse)

module.exports = MessageRouter