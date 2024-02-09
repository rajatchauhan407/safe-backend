import mongoose from "mongoose";
import logger from "./logger/logger.js";
import dotenv from "dotenv";

dotenv.config();


// connection to the database
async function connectToMongoDB(){
    
    const mongoURI = `mongodb+srv://techandtribe:${process.env.MONGO_PASSWORD}@cluster0.ylmqodn.mongodb.net/?retryWrites=true&w=majority`
    try {
      await mongoose.connect(mongoURI);
      logger.info('Connected to MongoDB successfully');
    } catch (error) {
      logger.error('Error connecting to MongoDB:', error);
      throw new Error('Error connecting to MongoDB');
       
    }
}

  export default connectToMongoDB;