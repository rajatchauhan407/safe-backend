/*=============================================
=            import external modules          =
=============================================*/
import express, { Application, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

/*=============================================
=            import custom modules          =
=============================================*/
import connectToMongoDB from './utils/connectDB.js';
import {corsOptions} from './config/cors.js';
import logger from './utils/logger/logger.js';
import userInfo from './utils/logger/userInfo.js';
import GeoLocationRoutes from './routes/geoLocationRoutes.js'

// Load environment variables
dotenv.config();



class Server {
    private app:Application;

    constructor() {
        this.app = express();
        this.setUpMiddlewares();
        this.setRoutes();
    }

// setting up middlewares
setUpMiddlewares():void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:true}));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
    this.app.use(this.errorHandler.bind(this));
}

// setting port
    public setPort():number {
        const PORT:number = parseInt(process.env.PORT || '9000', 10);
        return PORT;
    }

// setting routes
    public setRoutes():void {
        this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
            res.send('Hello World');           
    });
    this.app.use(GeoLocationRoutes)
    }

  // error handler
    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
      // console.error(err.stack);
      logger.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    }

// start server 
    public async startServer(port:number):Promise<void> {
        try{
          await connectToMongoDB();
          this.app.listen(port, () => 
          {     
              logger.warn(
            'checking'
              )
              if(process.env.NODE_ENV === 'development'){
                logger.info(`Server is running on port ${port} and the user is ${userInfo.user}`);
              }else{
                logger.info(`Server is running on port ${port}`);
              }
          });
        }catch(error){
            if(process.env.NODE_ENV === 'development'){
              logger.error(`Error: ${error} and the user is ${userInfo.user}`);
            }else{
                logger.error(`Error: ${error}`);
            }
        
    }
} 
}

const server = new Server();
const PORT = server.setPort();
server.startServer(PORT);