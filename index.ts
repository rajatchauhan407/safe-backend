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

// Load environment variables
dotenv.config();



class Server {
    private app:Application;

    constructor() {
        this.app = express();
        this.setUpMiddlewares();
        this.setRoutes();
    }
// connection to the database
    public connectToMongoDB():void {
        connectToMongoDB();
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
    }

  // error handler
    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
      // console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    }

// start server 
    public async startServer(port:number):Promise<void> {
        try{
          // await connectToMongoDB();
          this.app.listen(port, () => {
              console.log(`Server is running on port ${port}`);
          });
        }catch(error){
            console.log(error);
            
        }
        
    }
} 

const server = new Server();
const PORT = server.setPort();
server.startServer(PORT);