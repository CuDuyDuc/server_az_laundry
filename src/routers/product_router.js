const Router = require('express');
const { addProduct } = require('../controllers/product_controller');

const ProductRouter = Router();

ProductRouter.post('/addProduct', addProduct);

module.exports = ProductRouter;