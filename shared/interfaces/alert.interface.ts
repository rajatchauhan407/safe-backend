import { Role } from '../enums/role.enum';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';
import { Document } from 'mongoose';
import { IEmergencySituation } from './emergencySituation.interface';
export interface IAlert extends Document{
    role:Role;
    userId:IUser['_id'];
    alertLocation:ILocation;
    emergencySituationId:IEmergencySituation['_id'];
    emergencyNotification:boolean;
    timestamp:Date;
    responseAction?:string;
    followUpAction?:string;
    recipients?:IUser[];
    emergencyText?:string;
    resolved:boolean;
}