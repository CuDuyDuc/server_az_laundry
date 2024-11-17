const Router = require('express').Router;
const { addReview, getReview, getReviewById } = require('../controllers/review_controller');
const upload = require('../public/upload');

const ReviewRouter = Router();

// Endpoint thêm đánh giá
ReviewRouter.post('/add-review', upload.array('files', 5), addReview);
ReviewRouter.get('/get-review', getReview);
ReviewRouter.get('/get-review/:orderId', getReviewById);

module.exports = ReviewRouter;
