import {model, Schema} from "mongoose";

import { ILocation } from "../shared/interfaces/location.interface";

const locationSchema = new Schema<ILocation>({
    type: {type: String, required: true},
    coordinates: {type:[Number], required: true},
    radius: {type: Number},
});

export default model<ILocation>("Location", locationSchema);