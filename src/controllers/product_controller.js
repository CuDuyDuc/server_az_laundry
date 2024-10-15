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
        data_product:data.data_product,
        product_description:data.product_description,
        id_product_type: data.id_product_type
    })
    await newProduct.save();
    res.status(200).json({
        "data":newProduct
    })
});

module.exports = {addProduct}