import User from "../../models/user.model.js";
import {IUser} from "../../shared/interfaces/user.interface";
import {Role} from "../../shared/enums/role.enum";
import Authentication from "../auth/auth.js";
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
    }): Promise<IUser> {
        // Generate Salt from Authentication class
        const salt = Authentication.generateSalt();
        try {
            let newUser = new User(userData);
            newUser.salt = salt;
            const hashedPassword = Authentication.hashPassword(userData.password, salt);
            newUser.password = hashedPassword;
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            throw error;
        }
    
    }
// update user
    public async updateUser(userId: string,userData:{}): Promise<IUser | null> {
        try {
            const updatedUser = await User.findOneAndUpdate({ _id:userId },userData,{ new: true });
            if(updatedUser){
                return updatedUser;
            }else{
                return null;
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
    public async getUsers(): Promise<IUser[]> {
        try {
            const users = await User.find({});
            return users;
        } catch (error) {
            throw error;
        }
    }
// get user by id
    public async getUser(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ userId:userId });
            return user;
        } catch (error) {
            throw error;
        }
    }

}

export default UserService;