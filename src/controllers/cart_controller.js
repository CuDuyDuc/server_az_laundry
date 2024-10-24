const asyncHandle = require('express-async-handler')
const CartModel = require('../models/cart_model')

const addCart = asyncHandle(async(req,res)=>{
    const {id_user,id_product,product_quantity,cart_subtotal}=req.body

    const existingCart = await CartModel.find({id_user,id_product}).populate('id_user').populate('id_product')
    if(existingCart){
        let quantity = product_quantity ? product_quantity : existingCart.product_quantity + 1;
        existingCart.product_quantity += quantity;
        existingCart.cart_subtotal+=cart_subtotal
        const updatedCart = (await(await existingCart.save()).populate('id_user').populate('id_product'))
        res.status(200).json({ data: updatedCart });
    }else{
        const newCart = new CartModel({
            id_user,
            id_product,
            product_quantity,
            cart_subtotal
        })
        const result = (await(await newCart.save()).populate('id_user').populate('id_product'))
        if (result) {
            res.status(200).json({
                "data": result
            })
        } else {
            res.status(401);
            throw new Error("Lỗi thêm")
        }
    }
    
})
const getDataCart = asyncHandle(async (req, res) => {
    const {  id_user } = req.query; 
    const data = await CartModel.find({id_user}).populate("id_product").populate("id_user");
    if (data) {
        res.status(200).json({
            "data": data
        });
    } else {
        res.status(404).json({
            "message": "Data not found"
        });
    }
});
const updateCart = asyncHandle(async(req,res)=>{
    const {id}=req.params;
    const data = req.body;
    const result = await CartModel.findByIdAndUpdate(id,{product_quantity:data.product_quantity,cart_subtotal:data.cart_subtotal});
    if(result){
        res.json({
            "status": 200,
            "messenger": "Sửa thành công",
            "data": result
        })
    }else{
        res.status(401);
        throw new Error("Lỗi")
    }
})
const deleteCart = asyncHandle(async(req,res)=>{
    const {id}=req.params;
    const result = await CartModel.findByIdAndDelete(id);
    if(result){
        res.status(200).json({'messenger':'thành công'})
    }else{
        res.status(401);
        throw new Error("Lỗi")
    }
})
module.exports={addCart,getDataCart,updateCart,deleteCart}