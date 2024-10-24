const express = require("express")
const cors = require('cors')
const connectDB = require("./src/configs/connectDB")
const errorMiddleHandle = require("./src/middlewares/errorMiddleWare")
const RoleRouter = require("./src/routers/role_router")
const AuthRouter = require("./src/routers/auth_router")
const { createAdminIfNotExists } = require("./src/controllers/auth_controller")
const ServiceTypeRouter = require("./src/routers/service_type_router")
const ProductRouter = require("./src/routers/product_router")
const ProductTypeRouter = require("./src/routers/product_type_router")
const RouterTip = require("./src/routers/tip_router")
const CartRouter = require("./src/routers/cart_route")
const chatRouter = require("./src/routers/chat_router")
const MessageRouter = require("./src/routers/message_router")



const app = express()
app.use(cors())
require('dotenv').config
app.use(express.json());
app.use(errorMiddleHandle)
const PORT = 3000

app.use('/api/role' ,RoleRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/service-type', ServiceTypeRouter)
app.use('/api/product', ProductRouter)
app.use('/api/product-type', ProductTypeRouter)
app.use('/api/tip', RouterTip)

app.use('/api/cart',CartRouter);

app.use("/api/chats", chatRouter);
app.use("/api/messages", MessageRouter);

createAdminIfNotExists();

connectDB()

app.listen(PORT, (err) => {
    if(err) {
        console.log(err)
        return
    }

    console.log(`Server starting at http://localhost:${PORT}`)
})
