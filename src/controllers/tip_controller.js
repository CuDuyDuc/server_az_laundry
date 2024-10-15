const asyncHandler = require('express-async-handler');
const TipModel = require('../models/tip_model');
const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const firebaseConfig = require("../configs/firebase.config");
initializeApp(firebaseConfig)
const storage = getStorage()


const addTip = asyncHandler(async (req, res) => {
    if (!req.files || !req.files.thumbnail || !req.files.body_image) {
        return res.status(400).send('Both thumbnail and body image are required.');
    }
    const thumbnailFile = req.files.thumbnail[0]; 
    const thumbnailRef = ref(storage, `tips/thumbnails/${thumbnailFile.originalname}`);
    const thumbnailMetadata = {
        contentType: thumbnailFile.mimetype,
    };
    const thumbnailSnapshot = await uploadBytesResumable(thumbnailRef, thumbnailFile.buffer, thumbnailMetadata);
    const thumbnailURL = await getDownloadURL(thumbnailSnapshot.ref);
    const bodyImageFile = req.files.body_image[0]; 
    const bodyImageRef = ref(storage, `tips/bodyImage/${bodyImageFile.originalname}`);
    const bodyImageMetadata = {
        contentType: bodyImageFile.mimetype,
    };
    const bodyImageSnapshot = await uploadBytesResumable(bodyImageRef, bodyImageFile.buffer, bodyImageMetadata);
    const bodyImageURL = await getDownloadURL(bodyImageSnapshot.ref);
    const data = req.body;
    const newTip = new TipModel({
        thumbnail: thumbnailURL,
        body_image: bodyImageURL,  
        title: data.title,
        content_header: data.content_header,
        content_footer: data.content_footer,
    });
    await newTip.save();
    res.status(200).json({
        data: newTip,
    });
});

const getTips= asyncHandler(async (_req, res) => {
    const data = await TipModel.find().sort({ createAt: -1 });
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


module.exports={addTip,getTips}