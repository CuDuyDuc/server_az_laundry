const Router = require('express');
const { createPayment, handleVNPayReturn } = require('../controllers/payment_controller');

const PaymentRouter = Router();

PaymentRouter.post('/create-payment',createPayment)
PaymentRouter.get('/vnpay_return', handleVNPayReturn);
module.exports = PaymentRouter;