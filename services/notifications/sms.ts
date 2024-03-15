import twilio from 'twilio';
// import EmergencyContact from '../../models/emergencyContact.model.js';
import dotenv from 'dotenv';
import NotificationService from './notifications.js';
// ========================================
dotenv.config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPohoneNumber = process.env.TWILIO_PHONE_NUMBER;

class SMSService{
  
    // public twilioClient: Twilio;
    public twilioClient: any;
    // public messageText: string = 'Emergency Alert';
    // public emergencyContact: string = '+16047206967';
    // public emergencyContactName: string = 'Emergency Contact';

    constructor() {
      // super();
        // this.twilioClient = new Twilio(accountSid, authToken);
        this.twilioClient = twilio(accountSid, authToken);
      }
    // ==========================================
    // This method can be used if we want to connect the EmergencyContact model to the SMS service
    //  ||
    // \\// 
    //  \/
    //   async emergencyContactCall(messageText: string): Promise<void> {
    //     try {
    //         // Fetch emergency contacts from MongoDB
    //         const emergencyContacts = await EmergencyContact.find({}, 'phoneNumber');

    //         // Sending SMS to each emergency contact
    //         for (const contact of emergencyContacts) {
    //             await this.sendEmergencySMS(contact.phoneNumber, messageText);
    //         }
    //     } catch (error) {
    //         console.error('Error sending SMS:', error);
    //     }
    // }
    // ======== End of the method
    // ==========================================

      async sendEmergencySMS(recipientNumber: string, messageText: string): Promise<void> {
        try {
          const response = await this.twilioClient.messages.create({
            body: messageText,
            // to: '+16047206967',
            to: recipientNumber,
            from: twilioPohoneNumber,
          });
    
          console.log('SMS sent successfully:', response);
        } catch (error) {
          console.error('Error sending SMS:', error);
          throw error;
        }
      }
    
    }
    export default new SMSService();
