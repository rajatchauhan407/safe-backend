import {model, Schema} from "mongoose";

import { IConstructionSite } from "../shared/interfaces/constructionSite.interface";
import Address from "./address.model.js";
import Location from "./location.model.js";
const constructionSiteSchema = new Schema<IConstructionSite>({
    address: {type:Address.schema, required: true},
    supervisorId: {type: String, required: true},
    siteLocation: {type: Location.schema, required: true},
    safeZoneLocation: {type: Location.schema, required: true},
    companyId: {type: String, required: true},
    workers: [{type: Schema.Types.ObjectId, ref: "User"}]
});

export default model<IConstructionSite>("ConstructionSite", constructionSiteSchema);   