import {Server as SocketIOServer} from 'socket.io';
import {IAlert} from '../../shared/interfaces/alert.interface';
class NotificationService {
  public io:SocketIOServer;
  constructor(io:SocketIOServer){
    this.io = io;
  }

  // alert supervisor
  public alertSupervisor(alertData:IAlert){
    console.log('alertData:',alertData)
    this.io.emit('alert',alertData);
  }
}   

export default NotificationService;