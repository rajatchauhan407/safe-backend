import { IAddress } from "./address.interface"
import { ILocation } from "./location.interface";
import { IUser } from "./user.interface"
import { Document } from "mongoose";


export interface IConstructionSite extends Document{
    addressId: IAddress["_id"];
    supervisorId: string;
    siteLocation: ILocation;
    safeZoneLocation: ILocation;
    companyId: string;
    workers?: IUser[];
}