import { Document } from "mongoose";


enum UserRole{
    ADMIN = "admin",
    WORKER = "worker",
    USER = "user"
}
export interface IChecking extends Document {
    userType: UserRole,
    userId: string,
    constructionSiteId: string,
    timeStamps: Date,
}