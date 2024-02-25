import User from "../../models/user.model";
import {IUser} from "../../shared/interfaces/user.interface";
class UserService {
    public async createUser(userData:{
        constructionSiteId: string;
        role: string;
        userId: string;
        userName: string;
        password: string;
        firstName: string;
        lastName: string;
        jobPosition: string;
        emergencyPhoneNumber?: string;
        bloodType?: string;
        medicalInfo?: string;
        salt: string;
    }): Promise<IUser> {
        try {
            const newUser = new User(userData);
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            throw error;
        }
    
    }

    public async updateUser(userId: string, user: IUser): Promise<IUser | null> {
        try {
            const updatedUser = await User.findOneAndUpdate({ userId }, user, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
    public async deleteUser(userId: string): Promise<IUser | null> {
        try {
            const deletedUser = await User.findOneAndDelete({ userId });
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
    public async getUsers(): Promise<IUser[]> {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw error;
        }
    }
    public async getUser(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ _id:userId });
            return user;
        } catch (error) {
            throw error;
        }
    }

}

export default UserService;