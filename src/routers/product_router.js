const Router = require('express');
const { addProduct, getProduct, getProductByIdUser, getProductsByIdUserAndIdProductType } = require('../controllers/product_controller');
const multer = require("multer");

const ProductRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
ProductRouter.post('/addProduct',upload.array("image",5), addProduct);
ProductRouter.post('/getProduct', getProduct);
ProductRouter.get('/get-product-by-id', getProductByIdUser);
ProductRouter.get('/get-product-by-user/:id_user/and-product/:id_product_type', getProductsByIdUserAndIdProductType);

module.exports = ProductRouter; 