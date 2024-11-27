const Router = require('express');
const { createPayment, handleVNPayReturn, getOrder, getOrderById, updateConfirmationStatus, getOrdersByStatus, getOrderByIdUser, getOrderByIdShop } = require('../controllers/payment_controller');

const PaymentRouter = Router();

PaymentRouter.post('/create-payment',createPayment)
PaymentRouter.get('/vnpay_return', handleVNPayReturn)
PaymentRouter.get('/get-order', getOrder)
PaymentRouter.get('/get-order-by-id-shop', getOrderByIdShop)
PaymentRouter.get('/get-order-by-id/:_id', getOrderById)
PaymentRouter.get('/get-order-by-id-user/:id_user', getOrderByIdUser)
PaymentRouter.post('/update-confirmation-status', updateConfirmationStatus)
PaymentRouter.get('/get-orders-by-status', getOrdersByStatus);

module.exports = PaymentRouter;