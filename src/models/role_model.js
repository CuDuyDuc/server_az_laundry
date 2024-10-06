const { default: mongoose } = require("mongoose");


const roleSchame = new mongoose.Schema({
    name_role: {
        type: String
    }
}, {timestamps: true})

const RoleModel = mongoose.model('role', roleSchame)
module.exports =  RoleModel