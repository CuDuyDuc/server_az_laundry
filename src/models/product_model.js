const { default: mongoose } = require("mongoose");

const ProductSchame = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId
    },
    product_name: {
        type: String, 
        require: true
    },
    product_photo: {
        type: String,
        require: true
    },
    product_price: {
        type: Number,
        require: true
    },
    data_product: {
        type : Object
    },
    product_description: {
        type: String
    },
    id_product_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_type"
    },
},{timestamps: true})

const ProductModel = mongoose.model('product', ProductSchame);
module.exports = ProductModel;