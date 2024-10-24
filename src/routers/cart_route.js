const { Router } = require("express");
const { addCart, getDataCart, updateCart, deleteCart } = require("../controllers/cart_controller");

const CartRouter = Router();
CartRouter.post("/add-product-cart",addCart);
CartRouter.get("/get-cart",getDataCart);
CartRouter.put("/update-cart/:id",updateCart);
CartRouter.delete("/delete-cart/:id",deleteCart);

module.exports = CartRouter;