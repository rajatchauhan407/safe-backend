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
        const { contacts, constructionSiteId }: { contacts: { phoneNumber: string }[], constructionSiteId: string } = req.body;

        // Fetching the construction site details
        const constructionSite = await constructionSiteModel.findOne({ _id: constructionSiteId });
        if (!constructionSite) {
            throw new Error('Construction site not found');
        }

        // Attempt to find the most recent alert
        const smsText = await Alert.findOne({ constructionSiteId: constructionSiteId, smsSent: false })
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
          emergencyLevel: smsText.degreeOfEmergency,
          exactLocation: smsText.location,
        };

        const message = `!SAFE Alert! 
        Number of Workers Injured: ${smsTextDetails.workersInjured}
        Location: ${smsTextDetails.exactLocation} ${smsTextDetails.locationStreet}, ${smsTextDetails.locationCity}, ${smsTextDetails.locationProvince}, ${smsTextDetails.locationZip} 
        Urgency Level: ${smsTextDetails.emergencyLevel}
        Situation: ${smsTextDetails.emergencyType}
        Immediate assistance required.
        Please respond promptly.
        Urgency Levels:
        1 - Low urgency
        2 - Moderate urgency
        3 - High urgency`;

        // Sending SMS to each emergency contact
        for (const contact of contacts) {
            if (contact && contact.phoneNumber) {
                await SMSService.sendEmergencySMS(contact.phoneNumber, message);
            }
        }
        await Alert.updateOne({ _id: smsText._id }, { $set: { smsSent: true }});
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
        emergencyLevel: smsText.degreeOfEmergency,
        exactLocation: smsText.location,
      };
      
      const textMessage = `!SAFE Alert! 
      Number of Workers Injured: ${smsTextDetails.workersInjured}
      Location: ${smsTextDetails.exactLocation} ${smsTextDetails.locationStreet}, ${smsTextDetails.locationCity}, ${smsTextDetails.locationProvince}, ${smsTextDetails.locationZip} 
      Urgency Level: ${smsTextDetails.emergencyLevel}
      Situation: ${smsTextDetails.emergencyType}
      Immediate assistance required.
      Please respond promptly.
      Urgency Levels:
      1 - Low urgency
      2 - Moderate urgency
      3 - High urgency`;

          res.status(200).json(textMessage);
          console.log(textMessage);
          
        } catch (error) {
          next(error);
        }
      }
    }
export default new smsNotificationController();
