const { request } = require('express')
const asyncHandler = require('express-async-handler')
const RoleModel = require('../models/role_model')

const addRole = asyncHandler(async (req, res) => {
    try {
        const { name_role } = req.body
        const newRole = new RoleModel({ name_role })
        const saveRole = newRole.save()
        if (saveRole) {
            res.status(200).json({
                message: "thêm thành công",
                data: newRole,
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports={addRole}