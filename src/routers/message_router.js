const Router = require("express")
const { createMessage, getMessage } = require("../controllers/message_controller")

const MessageRouter = Router()

MessageRouter.post('/create-message', createMessage)
MessageRouter.get('/get-message/:chatId', getMessage)

module.exports = MessageRouter