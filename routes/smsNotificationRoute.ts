import Express from "express";
import validateJWT from '../shared/validations/validateJWT.js';
import smsNotificationController from '../controllers/smsNotificationController.js';
const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router
router.use(validateJWT);

// =========================================
router.post("/sms",smsNotificationController.emergencyCall);
router.post("/sms-text",smsNotificationController.getSMSTextDetails);

export default router;