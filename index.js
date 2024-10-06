const express = require("express")
const cors = require('cors')
const connectDB = require("./src/configs/connectDB")
const errorMiddleHandle = require("./src/middlewares/errorMiddleWare")
const RoleRouter = require("./src/routers/role_router")
const AuthRouter = require("./src/routers/auth_router")


const app = express()
app.use(cors())
require('dotenv').config
app.use(express.json());
app.use(errorMiddleHandle)
const PORT = 3000

app.use('/api/role' ,RoleRouter)
app.use('/api/auth', AuthRouter)
connectDB()

app.listen(PORT, (err) => {
    if(err) {
        console.log(err)
        return
    }

    console.log(`Server starting at http://localhost:${PORT}`)
})
