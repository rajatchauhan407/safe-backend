import Express from "express";
import SMSNotificationController from '../controllers/smsNotificationController';
// =========================================
const router = Express.Router();
router.post("/sms/emergency/call",SMSNotificationController.emergencyCall);

export default router;