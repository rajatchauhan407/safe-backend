import { Document } from "mongoose";
import { Role } from "../enums/role.enum";


export interface IChecking extends Document {
    userType: Role,
    userId: string,
    constructionSiteId: string,
    timeStamp: Date
}