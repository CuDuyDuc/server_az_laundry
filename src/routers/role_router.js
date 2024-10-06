const Router = require('express')
const { addRole } = require('../controllers/role_controller')

const RoleRouter = Router()

RoleRouter.post('/add-role',addRole)

module.exports = RoleRouter