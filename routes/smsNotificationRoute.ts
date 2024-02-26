import Express from "express";
const router = Express.Router();
import smsNotificationController from '../controllers/smsNotificationController.js';
// =========================================
router.post("/sms",smsNotificationController.emergencyCall);

export default router;