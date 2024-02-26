import twilio from 'twilio';
import EmergencyContact from '../../models/emergencyContact.model';
import dotenv from 'dotenv';
// ========================================
dotenv.config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPohoneNumber = process.env.TWILIO_PHONE_NUMBER;

class SMSService{
    // public twilioClient: Twilio;
    public twilioClient: any;
    public messageText: string = 'Emergency Alert';
    // public emergencyContact: string = '+16047206967';
    // public emergencyContactName: string = 'Emergency Contact';

    constructor() {
        // this.twilioClient = new Twilio(accountSid, authToken);
        this.twilioClient = twilio(accountSid, authToken);
      }

      async emergencyContactCall(messageText: string): Promise<void> {
        try {
            // Fetch emergency contacts from MongoDB
            const emergencyContacts = await EmergencyContact.find({}, 'phoneNumber');

            // Sending SMS to each emergency contact
            for (const contact of emergencyContacts) {
                await this.sendEmergencySMS(contact.phoneNumber, messageText);
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    }
      async sendEmergencySMS(recipientNumber: string, messageText: string): Promise<void> {
        try {
          const response = await this.twilioClient.messages.create({
            // body: 'Emergency Alert',
            body: messageText,
            // to: '+16047206967',
            to: recipientNumber,
            from: twilioPohoneNumber,
          });
    
          console.log('SMS sent successfully:', response);
        } catch (error) {
          console.error('Error sending SMS:', error);
        }
      }
    
    }
    export default new SMSService();
