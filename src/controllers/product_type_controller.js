const asyncHandler = require('express-async-handler');
const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const firebaseConfig = require("../configs/firebase.config");
const Product_Type_Model = require('../models/product_type');
initializeApp(firebaseConfig)
const storage = getStorage()

const addProductType = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const file = req.file;
    const storageRef = ref(storage, `product_type_icon/${file.originalname}`);
    const metadata = {
        contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const data = req.body;
    const newProductType = new Product_Type_Model({
        product_type_name: data.product_type_name,
        product_type_icon: downloadURL,
    });
    await newProductType.save();
    res.status(200).json({
        data: newProductType,
    });
});

module.exports = {addProductType}