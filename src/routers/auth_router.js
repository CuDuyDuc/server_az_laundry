const Router = require('express');
const { register, login, verification, forgotPassword, getUserData, handleLoginWithGoogle, createUser, getShops, getUserById, getShopsByProductType, findUserId } = require('../controllers/auth_controller');
const multer = require('multer');

const AuthRouter = Router();
const upload = multer({
    storage: multer.memoryStorage(),
});
AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.post('/verification', verification)
AuthRouter.post('/forgotPassword', forgotPassword)
AuthRouter.get('/get-users', getUserData)
AuthRouter.post('/signInWithGoogle', handleLoginWithGoogle)
AuthRouter.post('/create-user', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'shop_banner', maxCount: 1 }
]), createUser);
AuthRouter.post('/get-shops',getShops),
AuthRouter.get('/get-user-by-id',getUserById)
AuthRouter.get('/get-user-id',getUserById)
AuthRouter.post('/get-shop-by-product-type',getShopsByProductType)
AuthRouter.get('/find-user/:userId',findUserId)
module.exports = AuthRouter;