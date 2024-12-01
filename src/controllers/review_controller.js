const asyncHandler = require('express-async-handler');
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const ReviewModel = require('../models/review_model');
const storage = getStorage(undefined, "gs://az-laundry.appspot.com");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../configs/firebase.config");
initializeApp(firebaseConfig)

const addReview = asyncHandler(async (req, res) => {
    try {
        const { orderId, rating, comment, id_user } = req.body;

        if (!orderId || !rating) {
            return res.status(400).json({ message: 'Vui lòng cung cấp orderId và rating!' });
        }

        const images = [];
        const videos = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const folder = file.mimetype.startsWith('image/') ? 'images/' : 'videos/';
                const storageRef = ref(storage, `${folder}${file.originalname}`);
                const metadata = { contentType: file.mimetype };

                const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
                const downloadURL = await getDownloadURL(snapshot.ref);

                if (file.mimetype.startsWith('image/')) {
                    images.push(downloadURL);
                } else if (file.mimetype.startsWith('video/')) {
                    videos.push(downloadURL);
                }
            }
        }

        const newReview = new ReviewModel({
            id_user,
            orderId,
            images,
            videos,
            rating,
            comment
        });

        await newReview.save();

        res.status(200).json({ 
            message: 'Đánh giá đã được thêm thành công!', 
            review: newReview 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Có lỗi xảy ra khi thêm đánh giá!', 
            error: error.message 
        });
    }
});

const getReview = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;

        const reviews = await ReviewModel.find()
            .populate({
                path: 'orderId',
                populate: {
                    path: 'id_cart',
                    populate: {
                        path: 'id_product',
                        match: { id_user: userId },
                    },
                }
            });
        res.status(200).json({
            message: "Lấy review thành công",
            data: reviews,
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

const getReviewById = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const review = await ReviewModel.findOne({ orderId })
            .populate('orderId');
        res.status(200).json({
            message: "Lấy review thành công",
            data: review,
        });
    } catch (error) {
        res.status(500).json({
            message: "Có lỗi xảy ra khi lấy review",
            error: error.message,
        });
    }
});

module.exports = { addReview, getReview, getReviewById };
