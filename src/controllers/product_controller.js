const asyncHandler = require('express-async-handler');
const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const firebaseConfig = require("../configs/firebase.config");
const ProductModel = require('../models/product_model');
initializeApp(firebaseConfig)
const storage = getStorage()

const addProduct = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const downloadURLs = []; 
    for (const file of req.files) {
        const storageRef = ref(storage, `products/${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        downloadURLs.push(downloadURL);
    }
    const data = req.body;
    const newProduct = new ProductModel({
        product_photo : downloadURLs,
        product_name:data.product_name,
        product_price:data.product_price,
        id_user:data.id_user,
        data_product:data.data_product,
        product_description:data.product_description,
        short_description:data.short_description,
        id_product_type: data.id_product_type
    })
    await newProduct.save();
    res.status(200).json({
        "data":newProduct
    })
});

const getProduct = asyncHandler(async (_req, res) => {
    const data = await ProductModel.find().sort({ createAt: -1 });
    if (data) {
        res.status(200).json({
            "messenger": "Thành công",
            "data": data
        })
    } else {
        res.status(401)
        throw new Error("Lỗi data")
    }
})

const getProductByIdUser= asyncHandler(async(req,res)=>{
    try {
        const { id_user } = req.query;
        if(id_user){
            const products = await ProductModel.find({ id_user })
            .populate({
                path: 'id_product_type', 
                populate: { 
                    path: 'id_service_type',
                    model: 'service_type' 
                }
            })
            .sort({ 'id_product_type.id_service_type': 1 }) 
            .exec();

            res.status(200).json({
                "messenger": "Thành công",
                "data": products
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
})

const getProductsByIdUserAndIdProductType = asyncHandler(async(req,res)=>{
    const {id_user,id_product_type} =req.params
    const products = await ProductModel.find({id_user:id_user,id_product_type:id_product_type}).populate('id_user').populate('id_product_type')
    if(products){
        res.status(200).json({
            "messenger": "Thành công",
            "data": products
        })
    }else{
        res.status(500).json({ message: 'Error fetching products', error });

    }
})



module.exports = {addProduct, getProduct,getProductByIdUser,getProductsByIdUserAndIdProductType}