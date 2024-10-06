const Router = require('express');
const { register, login, verification, forgotPassword, getUserData, handleLoginWithGoogle } = require('../controllers/auth_controller');

const AuthRouter = Router();

AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.post('/verification', verification)
AuthRouter.post('/forgotPassword', forgotPassword)
AuthRouter.get('/getUserData', getUserData)
AuthRouter.post('/signInWithGoogle', handleLoginWithGoogle)

module.exports = AuthRouter;