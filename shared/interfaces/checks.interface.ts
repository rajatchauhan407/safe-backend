import { Document } from "mongoose";
import { Role } from "../enums/role.enum";


export interface IChecking extends Document {
    userType: Role,
    checkType: string,
    userId: string,
    constructionSiteId: string,
    timeStamp: Date
}