const Router = require('express');
const { addProductType, getDataProductType } = require('../controllers/product_type_controller');
const multer = require('multer');

const ProductTypeRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

ProductTypeRouter.post('/addProductType',upload.single("product_type_icon"), addProductType);
ProductTypeRouter.get('/get-product-type',getDataProductType);

module.exports = ProductTypeRouter;