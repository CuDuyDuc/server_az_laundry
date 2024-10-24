const { default: mongoose } = require("mongoose");

const CartSchame = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    product_quantity: {
        type: Number,
    },
    cart_subtotal: {
        type: Number,
        require: true
    },
    id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true

    },
},{timestamps: true})

const CartModel = mongoose.model('cart', CartSchame);
module.exports = CartModel;