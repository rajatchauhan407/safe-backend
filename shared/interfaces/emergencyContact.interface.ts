import { Document } from 'mongoose';

export interface IEmergencyContact extends Document{
    name: string;
    phoneNumber: string;    
}