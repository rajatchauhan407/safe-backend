import { Role } from '../enums/role.enum';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';
import { Document } from 'mongoose';
import { IEmergencySituation } from './emergencySituation.interface';
import { EmergencyType } from '../enums/emergencyType.enum';
import { DegreeOfEmergency } from '../enums/degreeOfEmergency.enum';
export interface IAlert extends Document{
    role:Role;
    userId:IUser['userId'];
    emergencyType:EmergencyType;
    reportingFor:string;
    degreeOfEmergency?:DegreeOfEmergency;
    alertLocation:ILocation;
    workersInjured:number;
    emergencySituationId:IEmergencySituation['_id'];
    emergencyNotification:boolean;
    timestamp:Date;
    responseAction?:string;
    followUpAction?:string;
    recipients?:IUser[];
    emergencyText?:string;
    resolved:boolean;
    assistance:boolean;
    imageUrl?:string;
}