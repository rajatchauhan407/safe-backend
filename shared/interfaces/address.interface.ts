import { Document } from "mongoose";

export interface IAddress extends Document {
  street: string;
  city: string;
  state: string;
  zip: string;
}