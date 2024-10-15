const Router = require('express');
const { addProduct, getProduct } = require('../controllers/product_controller');

const ProductRouter = Router();

ProductRouter.post('/addProduct', addProduct);
ProductRouter.post('/getProduct', getProduct);

module.exports = ProductRouter;