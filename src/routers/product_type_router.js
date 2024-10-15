const Router = require('express');
const { addProductType } = require('../controllers/product_type_controller');

const ProductTypeRouter = Router();

ProductTypeRouter.post('/addProductType', addProductType);

module.exports = ProductTypeRouter;