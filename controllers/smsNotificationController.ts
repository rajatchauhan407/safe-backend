import { Request, Response, NextFunction } from "express";
import Express from "express";
import SMSService from '../services/notifications/sms.js';

// =========================================
const app = Express();
class smsNotificationController{
    async emergencyCall(req: Request, res: Response, next: NextFunction) {
        try {
            // const { message } = req.body;
            const message = SMSService.messageText;
            await SMSService.emergencyContactCall(message); 
            res.json({ success: true, message: "Emergency SMS sent successfully" });
        } catch (error: any) {
            console.error("Error occurred:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    }
export default new smsNotificationController();
