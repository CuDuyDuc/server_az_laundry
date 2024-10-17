const { Router } = require("express");
const multer = require("multer");
const { addServiceType, getServiceType } = require("../controllers/service_type_controller");

const upload = multer({ storage: multer.memoryStorage() });
const ServiceTypeRouter = Router()

ServiceTypeRouter.post('/add-service-type',upload.single("service_type_icon"),addServiceType)
ServiceTypeRouter.get('/get-service-type',getServiceType)

module.exports = ServiceTypeRouter