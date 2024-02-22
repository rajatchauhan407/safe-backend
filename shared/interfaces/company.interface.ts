import { Document } from "mongoose";
import { IAddress } from "./address.interface";

export interface ICompany extends Document {
  companyName: string;
  phoneNumber: string;
  email: string;
  addressId: IAddress["_id"];
}