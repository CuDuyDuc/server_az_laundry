const { default: mongoose } = require("mongoose");

const serviceTypeSchema = new mongoose.Schema({

    service_type_name:{
        type:String,
        require:true
    },
    service_type_icon:{
        type:String,
    }      
},{
    timestamps:true
})

const ServiceTypeModel = mongoose.model('service_type',serviceTypeSchema)

module.exports = ServiceTypeModel