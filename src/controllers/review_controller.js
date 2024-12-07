const asyncHandler = require('express-async-handler');
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const ReviewModel = require('../models/review_model');
const storage = getStorage(undefined, "gs://az-laundry.appspot.com");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../configs/firebase.config");
const UserModel = require('../models/user_model');
initializeApp(firebaseConfig)

const addReview = asyncHandler(async (req, res) => {
    try {
        const { orderId, rating, comment, id_user, id_shop } = req.body;

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
            id_shop,
            orderId,
            images,
            videos,
            rating,
            comment
        });

        await newReview.save();
        const ratings = await ReviewModel.aggregate([
            { $match: { id_shop: id_shop } }, // Lọc theo id_shop
            { $group: { _id: "$id_shop", averageRating: { $avg: "$rating" } } }, // Tính trung bình rating
        ]);

        if (ratings.length > 0) {
            const averageRating = ratings[0].averageRating;

            // Cập nhật lại star_rating trong UserModel
            await UserModel.findByIdAndUpdate(
                id_shop,
                { "data_user.star_rating": Math.round(averageRating * 10) / 10 }, // Làm tròn 1 chữ số thập phân
                { new: true }
            );
        }
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

const getReviewByIdShop = asyncHandler(async (req, res) => {
    try {
        const { id_shop } = req.params;
        const review = await ReviewModel.find({ id_shop })
            .sort({ createdAt: -1 })
            .populate('id_user')
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
const updateShopStarRatings = async () => {
    try {
        const ratings = await ReviewModel.aggregate([
            {
                $group: {
                    _id: "$id_shop", // Nhóm theo id_shop
                    averageRating: { $avg: "$rating" }, // Tính trung bình rating
                },
            },
        ]);

        const updatePromises = ratings.map(async (rating) => {
            // Làm tròn giá trị trung bình rating lên 1 chữ số thập phân
            const roundedRating = Math.round(rating.averageRating * 10) / 10;

            return UserModel.findByIdAndUpdate(
                rating._id, // _id trong aggregate là id_shop
                { "data_user.star_rating": roundedRating || 0 }, // Gán giá trị trung bình đã làm tròn
                { new: true } // Trả về document đã được cập nhật
            );
        });

        await Promise.all(updatePromises);
        console.log('Star ratings updated successfully!');
    } catch (error) {
        console.error('Error updating star ratings:', error);
    }
};
module.exports = { addReview, getReview, getReviewById, getReviewByIdShop,updateShopStarRatings };
