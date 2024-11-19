const asyncHandler = require('express-async-handler');
const ReviewModel = require('../models/review_model');

const addReview = asyncHandler(async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;

        if (!orderId || !rating) {
            return res.status(400).json({ message: 'Vui lòng cung cấp orderId và rating!' });
        }

        const images = [];
        const videos = [];
        if (req.files) {
            req.files.forEach(file => {
                if (file.mimetype.startsWith('image/')) {
                    images.push(`/uploads/${file.filename}`);
                } else if (file.mimetype.startsWith('video/')) {
                    videos.push(`/uploads/${file.filename}`);
                }
            });
        }

        const newReview = new ReviewModel({
            orderId,
            images,
            videos,
            rating,
            comment
        });

        await newReview.save();

        res.status(200).json({ message: 'Đánh giá đã được thêm thành công!', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm đánh giá!', error: error.message });
    }
});

const getReview = asyncHandler(async (req, res) => {
    try {
        const reviews = await ReviewModel.find()
            .populate('orderId');
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
