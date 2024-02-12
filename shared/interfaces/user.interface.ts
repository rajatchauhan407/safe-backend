import { Role } from "../enums/role.enum";
import { Document } from 'mongoose';
import { IConstructionSite } from './constructionSite.interface';

export interface IUser extends Document{
    constructionSiteId: IConstructionSite['_id'];
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
}