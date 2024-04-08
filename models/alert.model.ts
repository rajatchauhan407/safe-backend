import { model, Schema } from "mongoose";
import { IAlert } from "../shared/interfaces/alert.interface";

const alertSchema = new Schema<IAlert>({
  role: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  constructionSiteId: { type: String, required:true},
  reportingFor: { type: String },
  emergencyType: { type: String },
  degreeOfEmergency: { type: Number},
  alertLocation: { type: Object},
  workersInjured: { type: Number},
  timestamp: { type: Date, required: true },
  responseAction: { type: Object, default: null},
  followUpAction: { type: String },
  recipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  emergencyText: { type: String},
  resolved: { type: Boolean, required: true, default: false},
  assistance: { type: Boolean},
  smsSent: { type: Boolean, required: true, default: false},
  imageUrl: { type: String },
  location:{type:String},
  sos: { type: Boolean, default:false},
});

export default model<IAlert>("Alert", alertSchema);
