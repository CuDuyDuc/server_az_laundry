const asyncHandler = require('express-async-handler');
const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const firebaseConfig = require("../configs/firebase.config");
const ServiceTypeModel = require('../models/service_type');
initializeApp(firebaseConfig)
const storage = getStorage()

const addServiceType = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const file = req.file;
    const storageRef = ref(storage, `service_type_icon/${file.originalname}`);
    const metadata = {
        contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const data = req.body;
    const newServiceType = new ServiceTypeModel({
        service_type_name: data.service_type_name,
        service_type_icon: downloadURL, 
    });
    await newServiceType.save();
    res.status(200).json({
        data: newServiceType,
    });
});
module.exports={addServiceType}