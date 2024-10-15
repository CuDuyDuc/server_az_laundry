const { default: mongoose } = require("mongoose");

const Product_Type_Schame = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    product_type_name: {
        type: String,
    },
    product_type_icon: {
        type: String
    },
    id_service_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service_type"
    }
}, {timestamps: true});

const Product_Type_Model = mongoose.model('product_type', Product_Type_Schame);
module.exports = Product_Type_Model;