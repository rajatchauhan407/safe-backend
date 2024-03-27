import { model, Schema } from "mongoose";
import { ISOSAlert } from "../shared/interfaces/sosalert.interface";

const sosAlertSchema = new Schema<ISOSAlert>({
    role: { type: String, required: true },
    userId: { type: String, required: true },
    constructionSiteId: { type: String, required:true},
    alertLocation: { type: Object, required: true },
    timestamp: { type: Date, required: true },
  });
  
  export default model<ISOSAlert>("SOSAlert", sosAlertSchema);