import { Role } from "../enums/role.enum";
import { Document } from 'mongoose';
import { IConstructionSite } from './constructionSite.interface';

export interface IUserWithout extends Document{
    constructionSiteId?: string;
    role:Role;
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    jobPosition: string;
    emergencyPhoneNumber?: string;
    bloodType?: string;
    medicalInfo?: string;
}