import Authentication from "./auth.js";
import User from '../../models/user.model.js';
import ApplicationError from "../../errors/applicationError.js";
import expoTokenModel from "../../models/expoToken.model.js";
import { IError } from "../../shared/interfaces/error.interface.js";
import { IExpoToken } from "../../shared/interfaces/expoToken.interface.js";
// ========================================

class LoginService extends Authentication {
    static async login(userId: string, password: string): Promise<string | null | boolean | IError> {
        try {
          const user = await User.findOne({ userId });
          if (!user) {
            throw new ApplicationError('User Not Found',404,'User Not Found','Hey be careful');
          }
    
    // Authenticate user using AuthService methods
      const isAuthenticated = await Authentication.authenticateUser(userId, password);
      if (!isAuthenticated) {
        console.log('Invalid credentials');
        throw new ApplicationError('Invalid credentials',404,'Invalid Credentials','error details')
      }

    // Generate JWT token using AuthService method
      const token = Authentication.generateToken(userId);
      return token;
    } catch (error) {
      console.error('Error logging in:', error);
      if(error instanceof ApplicationError){
        return error;
      }
      return new ApplicationError('Invalid Request',500,'internal server error','details')
      // return false;
    }
  }
  static async storeToken(tokenData:IExpoToken): Promise<IExpoToken | IError> {
    try {
      const expoToken = new expoTokenModel(tokenData);
      return await expoToken.save();
      }catch (error) {
        console.error('Error storing token:', error);
        return new ApplicationError('Invalid Request',500,'internal server error','details')
      }
  }
  static async deleteToken(userId: string): Promise<IExpoToken | IError> {
    try {
      const deletedToken = await expoTokenModel.findOneAndDelete({userId});
      if(!deletedToken){
        throw new ApplicationError('Token Not Found',404,'Token Not Found','details')
      }
      return deletedToken;
    } catch (error) {
      console.error('Error deleting token:', error);
      return new ApplicationError('Invalid Request',500,'internal server error','details')
    }
  }
  static async retrieveTokens(constructionSiteId: string): Promise<IError | IExpoToken[]>{
    try{

      const users = await User.find({constructionSiteId});

      if (!users) {
        throw new ApplicationError('No users found',404,'No users found','details')
      }

      let allTokens: IExpoToken[] = [];

      for(const user of users){
        /** Retrieving Token for a particular Id */
        const tokens = await expoTokenModel.find({userId:user.userId});
        
        if(!tokens){
          throw new ApplicationError('No tokens found',404,'No tokens found','details')
        }

        /** Saving all the tokens in allTokens array **/
        tokens.forEach(token => {
          allTokens.push(token);
        })
      }
      if(allTokens.length === 0){
        throw new ApplicationError('No tokens found',404,'No tokens found','details')
      }
      return allTokens;
    }catch(error){
        throw new ApplicationError('Invalid Request',500,'internal server error','details')
    }  
    

  }
}

export default LoginService;