const Router = require('express').Router;
const { addReview, getReview, getReviewById, getReviewByIdShop } = require('../controllers/review_controller');
const multer = require("multer");

const ReviewRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
// Endpoint thêm đánh giá
ReviewRouter.post('/add-review', upload.array('files', 5), addReview);
ReviewRouter.get('/get-review', getReview);
ReviewRouter.get('/get-review/:orderId', getReviewById);
ReviewRouter.get('/get-review-by-shop/:id_shop', getReviewByIdShop);

module.exports = ReviewRouter;
