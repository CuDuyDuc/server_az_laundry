const asyncHandler = require('express-async-handler')
const RoleModel = require('../models/role_model')

const addRole = asyncHandler(async (req, res) => {
    try {
        const { name_role } = req.body
        const newRole = new RoleModel({ name_role })
        const saveRole = await newRole.save()
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

const getRole = asyncHandler(async (req, res) => {
    try {
        const { check_role } = req.body
        const role = await RoleModel.findOne({name_role:'shop'})
        
        if(role){
            if (check_role) {
                res.status(200).json({
                    message: "Role Shop",
                    data: role,
                });
            }else{
                res.status(200).json({
                    message: "Role user",
                    data: role,
                });
            }
        }else{
            res.status(400).send("Vai trò không tìm thấy");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports={addRole,getRole}