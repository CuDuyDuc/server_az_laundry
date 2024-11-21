const Router = require('express')
const { addRole, getRole } = require('../controllers/role_controller')

const RoleRouter = Router()

RoleRouter.post('/add-role',addRole)
RoleRouter.post('/get-role',getRole)

module.exports = RoleRouter