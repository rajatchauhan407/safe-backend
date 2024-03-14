/*=============================================
=            import external modules          =
=============================================*/
import express, { Application, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import {Server as HttpServer} from 'http';
import {Server as SocketIOServer} from 'socket.io';

/*=============================================
=            import custom modules          =
=============================================*/
import connectToMongoDB from './utils/connectDB.js';
import {corsOptions} from './config/cors.js';
// import logger from './utils/logger/logger.js';
import userInfo from './utils/logger/userInfo.js';
import GeoLocationRoutes from './routes/geoLocationRoutes.js'
import AuthRoutes from './routes/register.route.js'
import UserRoutes from './routes/user.route.js'
import NotificationRoutes from './routes/notification.route.js'
import CompanyRoutes from './routes/company.route.js'
import { IError } from './shared/interfaces/error.interface';
import smsNotificationRoute from './routes/smsNotificationRoute.js';
import loginLogout from './routes/loginLogoutRoute.js';
import NotificationService from './services/notifications/notifications.js';
// Load environment variables
dotenv.config();



class Server {
    private app:Application;
    private httpServer:HttpServer;
    private io:SocketIOServer;
    public notificationService:NotificationService;
    constructor() {
        this.app = express();
        this.httpServer = new HttpServer(this.app); // wrapping the express app with Http Server
        this.io = new SocketIOServer(this.httpServer,{
          cors:{
            origin:"*",
            methods:["GET","POST"]
          }
        }); // wrapping the http server with socket.io
        this.setupSocket();
        this.setUpMiddlewares();
        this.setRoutes();

        // initializing notification service and setting it to the app
        this.notificationService = new NotificationService(this.io);

        // passing the notification service to the app so that it can be accessed from anywhere in the app
        this.app.set('notificationService',this.notificationService);

        // Error Handler
        this.app.use(this.errorHandler.bind(this));
    }

// setting up middlewares
setUpMiddlewares():void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:true}));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
}

// setting port
    public setPort():number {
        const PORT:number = parseInt(process.env.PORT || '9000', 10);
        return PORT;
    }

// setting routes
    public setRoutes():void {
      this.app.use('/api/v1', this.v1Routes());
        this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
            res.send('Hello World');           
    });
    }

  setupSocket():void {
    this.io.on('connection',(socket)=>{
        console.log('new connection')
        socket.on('disconnect',()=>{
            console.log('user disconnected')
        })
    })
  }
  // error handler
    private errorHandler(err: IError, req: Request, res: Response, next: NextFunction): void {
      // logger.error(err.stack);
      // console.log("hello")
      console.log(err)
      res.status(err.statusCode).json({ error: err.error,statusCode:err.statusCode,details: process.env.Node_ENV=="development"?err.details:null});
    }

  //  versioning routes
  private v1Routes(): express.Router {
    const router = express.Router();

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Hello World from API v1');
    });

    // Define other v1 specific routes here
    router.use(GeoLocationRoutes);
    router.use(AuthRoutes);
    router.use(UserRoutes);
    router.use(NotificationRoutes);
    router.use(CompanyRoutes);
    router.use(smsNotificationRoute);
    router.use(loginLogout);
   
    return router;
}
// start server 
    public async startServer(port:number):Promise<void> {
        try{
          await connectToMongoDB();
          this.httpServer.listen(port, () => 
          {     
            //   logger.warn(
            // 'checking'
            //   )
              if(process.env.NODE_ENV === 'development'){
                console.log(`Server is running on port ${port} and the user is ${userInfo.user}`)
                // logger.info(`Server is running on port ${port} and the user is ${userInfo.user}`);
              }else{
                // logger.info(`Server is running on port ${port}`);
                console.log(`Server is running on port ${port}`);
              }
          });
        }catch(error){
            if(process.env.NODE_ENV === 'development'){
              // logger.error(`Error: ${error} and the user is ${userInfo.user}`);
              console.log(`Error: ${error} and the user is ${userInfo.user}`);
            }else{
                // logger.error(`Error: ${error}`);
                console.log(`Error: ${error}`);
            }
        
    }
} 
}

const server = new Server();
const PORT = server.setPort();
server.startServer(PORT);
