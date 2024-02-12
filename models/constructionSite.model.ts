import {model, Schema} from "mongoose";

import { IConstructionSite } from "../shared/interfaces/constructionSite.interface";

const constructionSiteSchema = new Schema<IConstructionSite>({
    addressId: {type: Schema.Types.ObjectId, ref: "Address", required: true},
    supervisorId: {type: String, required: true},
    siteLocation: {type: Object, required: true},
    safeZoneLocation: {type: Object, required: true},
    companyId: {type: String, required: true},
    workers: [{type: Schema.Types.ObjectId, ref: "User"}]
});

export default model<IConstructionSite>("ConstructionSite", constructionSiteSchema);   