import mongoose from "mongoose";

// connection to the database
async function connectToMongoDB(){
    
    const mongoURI = `mongodb+srv://techandtribe:${process.env.MONGO_PASSWORD}@eco.r3jwhqr.mongodb.net/?retryWrites=true&w=majority`
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Error connecting to MongoDB');
       
    }
}

  export default connectToMongoDB;