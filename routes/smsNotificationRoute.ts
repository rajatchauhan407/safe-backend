import Express from "express";
import validateJWT from '../middlewares/validateJWT.js';
import smsNotificationController from '../controllers/smsNotificationController.js';
const router = Express.Router();

// =========================================
router.post("/sms",validateJWT,smsNotificationController.emergencyCall);
router.post("/sms-text",smsNotificationController.getSMSTextDetails);

export default router;