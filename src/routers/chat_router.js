const Router = require("express")
const { createChat, findUserChat, findChat, updateIsReadCount } = require("../controllers/chat_controller")

const chatRouter = Router()

chatRouter.post('/create-chat', createChat)
chatRouter.get('/find-user-chat/:userId', findUserChat)
chatRouter.get('/find-chat/:firstId/:secondId', findChat)
chatRouter.post('/update-chat-isRead', updateIsReadCount)

module.exports = chatRouter