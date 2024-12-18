const { default: mongoose } = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    id_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        required: true,
    },
    images: [String],
    videos: [String],
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type:String,
        maxLength: 500,
    },
}, { timestamps: true });

const ReviewModel = mongoose.model('review', ReviewSchema);

module.exports = ReviewModel;
