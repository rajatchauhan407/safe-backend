import {model, Schema} from "mongoose";
import { IUser } from "../shared/interfaces/user.interface";

const userSchema = new Schema<IUser>({
    constructionSiteId: {type: String, required: true},
    role: {type:String , required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    jobPosition: {type: String, required: true},
    emergencyPhoneNumber: {type: String},   
    bloodType: {type: String},
    medicalInfo: {type: String},
    salt: {type: String, required: true},
});

export default model<IUser>("User", userSchema);