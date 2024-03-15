import { Document } from 'mongoose';
import { LocationType } from '../enums/locationType.enum';

// Location and safeZone have the same structure, so we can use the same interface for both
export interface ILocation extends Document{
    type: LocationType;
    coordinates: [number, number];
    radius?: {type: Number, required: true};
}