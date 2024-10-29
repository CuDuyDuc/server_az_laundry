const asyncHandle = require('express-async-handler');
const crypto = require("crypto");
const moment = require('moment');
const PaymentModel = require('../models/payment_model');
const CartModel = require('../models/cart_model');
const querystring = require('qs');
require('dotenv').config();

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createPayment = asyncHandle(async (req, res) => {
    const { id_user, paymentMethod, data_payment , id_product} = req.body;
    const { shipping_fee, discount, taxes, total, shipping_date, delivery_date } = data_payment;
    let id_cart = null;
    const carts = await CartModel.find({ id_user: id_user,status:'Pending' }).populate('id_product');
    if (carts.length === 0) {
        return res.status(200).json({ message: "Không tìm thấy giỏ hàng, không thể thanh toán" });
    }
    if (!id_product) {
        id_cart = carts.map(cart => cart._id);
    }
    
    const amount_money = total + (shipping_fee || 0) - (discount || 0) + (taxes || 0);

    const payment = new PaymentModel({
        id_user,
        id_cart: id_cart,
        amount_money: amount_money,
        id_product:id_product||null,
        paymentMethod,
        status: 'Pending',
        data_payment: {
            shipping_fee: shipping_fee || 0,
            discount: discount || 0,
            taxes: taxes || 0,
            total: total,
            shipping_date: shipping_date,
            delivery_date: delivery_date
        }
    });

    try {
        await payment.save()
        const findIdUser = await PaymentModel.findById(payment._id).populate('id_user')
        if (paymentMethod === 'VNPay') {
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            const vnp_TmnCode = "9KDMIQHJ";
            const vnp_HashSecret = process.env.vnp_HashSecret;
            const vnp_ReturnUrl = "http://localhost:3000/api/payment/vnpay_return";
            const orderId = payment._id.toString();
            const createDate = moment().format('YYYYMMDDHHmmss');
            const vnp_Params = {
                vnp_Version: "2.1.0",
                vnp_Command: "pay",
                vnp_TmnCode,
                vnp_Amount: amount_money * 100,
                vnp_CurrCode: "VND",
                vnp_TxnRef: orderId,
                vnp_OrderInfo: `Thanh toán hóa đơn ${orderId}`,
                vnp_OrderType: "billpayment",
                vnp_Locale: "vn",
                vnp_ReturnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate
            };

            let sortedParams = sortObject(vnp_Params);
            let signData = querystring.stringify(sortedParams, { encode: false });
            let hmac = crypto.createHmac("sha512", vnp_HashSecret);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            sortedParams['vnp_SecureHash'] = signed;
            const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;
            return res.status(200).json({ success: true, paymentUrl });
        } else {
            if(findIdUser.status==="Pending"){
                await PaymentModel.findByIdAndUpdate(payment._id, { status: "COD" });
                const carts = await CartModel.updateMany(
                    { id_user: findIdUser.id_user._id, status: "Pending" },
                    { $set: { status: "COD" } }
                );
                if(carts){
                    return res.status(200).json({ data: payment, message: "Thanh toán thành công" });
                }
            }
            return res.status(500).json({ success: false, message: "fail" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

const handleVNPayReturn = asyncHandle(async (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;
    const vnp_HashSecret = process.env.vnp_HashSecret;
    let sortedParams = sortObject(vnp_Params);
    let signData = querystring.stringify(sortedParams, { encode: false });
    let hmac = crypto.createHmac("sha512", vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
        const orderId = vnp_Params.vnp_TxnRef;
        const paymentStatus = vnp_Params.vnp_ResponseCode === "00" ? "Paid" : "Failed";
        await PaymentModel.findByIdAndUpdate(orderId, { status: paymentStatus });
        const findIdUser = await PaymentModel.findById(orderId).populate('id_user')
        if(findIdUser.status==="Paid"){
            const carts = await CartModel.updateMany(
                { id_user: findIdUser.id_user._id, status: "Pending" },
                { $set: { status: "Paid" } }
            );
            if(carts){
                return res.status(200).json({ success: true, message: "Thanh toán thành công" });
            }
        }
        return res.status(200).json({ success: true, message: "Tới trang thanh toán thành công" });
    } else {
        return res.status(400).json({ success: false, message: "Xác thực thất bại" });
    }
});

module.exports = { createPayment, handleVNPayReturn };
