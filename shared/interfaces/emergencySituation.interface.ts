import { Document } from 'mongoose';
import { WhistleType } from '../enums/whistle.enum';
export interface IEmergencySituation extends Document{
    name: string;
    severity: string;
    firstAid: string;
    whistles: WhistleType;
}