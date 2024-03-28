import { Request, Response, NextFunction } from "express";
import Express from "express";
import SMSService from '../services/notifications/sms.js';
import ApplicationError from "../errors/applicationError.js";
import AlertService from "../services/notifications/alert.js";
import constructionSiteModel from "../models/constructionSite.model.js";
import { error } from "console";
import Alert from "../models/alert.model.js";
// =========================================

const app = Express();
class smsNotificationController{
    async emergencyCall(req: Request, res: Response, next: NextFunction) {
        try {
            // const { message } = req.body;
            // const message = SMSService.messageText;
            const { contacts, message }: { contacts: { phoneNumber: string }[], message: string } = req.body;
            //  Sending SMS to each emergency contact
            for (const contact of contacts) {
                await SMSService.sendEmergencySMS(contact.phoneNumber, message);
            }

            // Response
            res.json({ success: true, message: "Emergency SMS sent successfully", data: { contacts, message }});

        } catch (error: any) {
            console.error("Error occurred:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    // ======================================================================
    // Get the Alert Details:
    public async getSMSTextDetails(req: Request, res: Response, next: NextFunction) {
        try {
          // console.log(req.body);
          const { constructionSiteId } = req.body;
          // Fetching the construction site details
          const constructionSite = await constructionSiteModel.findOne({ _id: constructionSiteId });
            if (!constructionSite) {
             throw new Error('Construction site not found');
                 }

                 const smsText = await Alert.findOne({ constructionSiteId: constructionSiteId, resolved: false })
                 .sort({ timestamp: -1 }) // Sort by timestamp in descending order to get the newest
                 .limit(1); // Limit to 1 to get only the most recent document

                 if (!smsText) {
                    throw new Error('Alert not found');
                    }

          // Preparing the SMS text details
      const smsTextDetails = {
        locationStreet: constructionSite.address.street,
        locationCity: constructionSite.address.city,
        locationProvince: constructionSite.address.state,
        locationZip: constructionSite.address.zip,
        workersInjured: smsText.workersInjured,
        emergencyType: smsText.emergencyType,
      };
          res.status(200).json(smsTextDetails);
          
        } catch (error) {
          next(error);
        }
      }
    }
export default new smsNotificationController();
