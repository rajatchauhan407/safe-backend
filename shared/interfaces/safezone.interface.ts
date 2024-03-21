import { Document } from "mongoose";
import { Role } from "../enums/role.enum";


export interface ISafeZoneWorkers extends Document {
    userType: Role,
    userId: string,
    constructionSiteId: string,
    timeStamp: Date
}