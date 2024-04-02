import {Server as SocketIOServer} from 'socket.io';
import {IAlert} from '../../shared/interfaces/alert.interface';
import { IExpoToken } from '../../shared/interfaces/expoToken.interface';
import {Expo} from 'expo-server-sdk';
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
    name:'default',
    sound: 'default' as const, // Specify the sound as "default" using the 'as const' assertion
    body: 'Alert! There is an emergency at the construction site. Please check the app for more details.',
    data: { alertData: alertData },
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