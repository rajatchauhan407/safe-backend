import User from "../../models/user.model.js";
import {IUser} from "../../shared/interfaces/user.interface";
import {Role} from "../../shared/enums/role.enum";
import Authentication from "../auth/auth.js";
import ApplicationError from "../../errors/applicationError.js";
import { IUserWithout } from "../../shared/interfaces/userWithout.interface.js";
import { IError } from "../../shared/interfaces/error.interface.js";
class UserService {
    
    // Create a new user
    public async createUser(userData:{
    constructionSiteId: string;
    role:Role;
    userId: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    jobPosition: string;
    emergencyPhoneNumber?: string;
    bloodType?: string;
    medicalInfo?: string;
    salt?: string;
    }): Promise<IUserWithout | IError> {
        // Generate Salt from Authentication class
        const userSalt = Authentication.generateSalt();
        try {
            let newUser = new User(userData);
            newUser.salt = userSalt;
            const hashedPassword = Authentication.hashPassword(userData.password,userSalt);
            newUser.password = hashedPassword;
            const savedUser = await newUser.save();
            const {password,salt, ...userWithoutPassword} = savedUser.toObject();
            return userWithoutPassword as IUserWithout;
        } catch (error) {
            return new ApplicationError('Error saving user',400,'Error saving user',error)
        }
    
    }
// update user
    public async updateUser(userId: string,userData:{}): Promise<IUserWithout | IError | null> {
        try {
            const updatedUser = await User.findOneAndUpdate({ _id:userId },userData,{ new: true });
            if(updatedUser){
                const {password,salt, ...userWithoutPassword} = updatedUser.toObject();
                return userWithoutPassword as IUserWithout;
            }else{
                return new ApplicationError('User not found',404,'User not found',null);
            }
        } catch (error) {
            throw error;
        }
    }

// delete user
    public async deleteUser(userId: string): Promise<IUser | null> {
        try {
            const deletedUser = await User.findOneAndDelete({ userId });
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
// get all users
    public async getUsers(): Promise<IUserWithout[] | IError | null> {
        try {
            const users = await User.find({});
            const newUsers = users.map((user)=>{
                const {password,salt, ...userWithoutPassword} = user.toObject();
                return userWithoutPassword as IUserWithout;
            })
            return newUsers;
        } catch (error) {
            return new ApplicationError('Error getting users',400,'Error getting users',error)
        }
    }
// get user by id
    public async getUser(userId: string): Promise<any | null> {
        try {
            const user = await User.findOne({ userId:userId });
            if(user){
                const {password,salt, ...userWithoutPassword} = user.toObject();
                return userWithoutPassword;
            }else{
                return new ApplicationError('User not found',404,'User not found',null)
            }
        } catch (error) {
            return new ApplicationError('Error getting user',400,'Error getting user',error)
        }
    }

}

export default UserService;