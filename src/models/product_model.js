const { default: mongoose } = require("mongoose");

const ProductSchame = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId
    },
    product_name: {
        type: String, 
        require: true
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    product_photo: {
        type: Array,
        require: true
    },
    product_price: {
        type: Number,
        require: true
    },
    short_description:{
        type:String
    },
    product_description: {
        type: String
    },
    id_product_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_type",
        require: true

    },
},{timestamps: true})

const ProductModel = mongoose.model('product', ProductSchame);
module.exports = ProductModel;