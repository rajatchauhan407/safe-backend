import { Role } from '../enums/role.enum';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';
import { Document } from 'mongoose';

export interface ISOSAlert extends Document{
    role:Role;
    userId:string;
    constructionSiteId:string; 
    alertLocation:ILocation;
    timestamp:Date;
}