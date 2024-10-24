const Router = require("express")
const { createChat, findUserChat, findChat } = require("../controllers/chat_controller")

const chatRouter = Router()

chatRouter.post('/create-chat', createChat)
chatRouter.get('/find-user-chat/:userId', findUserChat)
chatRouter.get('/find-chat/:firstId/:secondId', findChat)

module.exports = chatRouter