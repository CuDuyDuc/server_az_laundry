const Router = require('express');
const multer = require('multer');
const { addTip, getTips } = require('../controllers/tip_controller');

const RouterTip = Router()
const upload = multer({
    storage: multer.memoryStorage(),
});
RouterTip.post('/add-tip', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'body_image', maxCount: 1 }
]), addTip);
RouterTip.get('/get-tips',getTips)

module.exports = RouterTip