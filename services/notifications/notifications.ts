import {Server as SocketIOServer} from 'socket.io';
import {IAlert} from '../../shared/interfaces/alert.interface';
import { IExpoToken } from '../../shared/interfaces/expoToken.interface';
import {Expo} from 'expo-server-sdk';
import { channel } from 'diagnostics_channel';
class NotificationService {
  public io:SocketIOServer;
  constructor(io:SocketIOServer){
    this.io = io;
  }

  // alert supervisor
  public alertSupervisor(alertData:IAlert){
    console.log('alertData:',alertData)
    this.io.emit('alert',true);
  }

  public alertWorker(alertData:IAlert){
    console.log('alertData:',alertData)
    this.io.emit('alertWorker',true);
  }

  public workerStatusAlert()
  {
    console.log('In workerStatusAlert')
    this.io.emit('workerstatus',true);
  }

  public safeZoneWorkerStatusAlert()
  {
    console.log('In safeZoneWorkerStatusAlert')
    this.io.emit('safezoneworker',true);
  }
   /****  Sending Push notifications to all the users ****/
  public async sendPushNotification(pushToken:string,alertData:IAlert){
    let expo = new Expo();

    let messages = [];

    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    }

     // Construct a message (for more advanced messages, you might include a URL, sound, etc.)
  messages.push({
    to: pushToken,
    name:'E-mail notifications',
    sound: 'default' as const, // Specify the sound as "default" using the 'as const' assertion
    priority:'high' as const,
    title: 'Alert from Construction Site',
    body: `${alertData.emergencyType ? alertData.emergencyType : 'Alert'} Emergency.There is an alert emergency at the construction site. Please check the alert.`,
    channelId: 'alert-notification',
  });
  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests individually!
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }


}
}   

export default NotificationService;