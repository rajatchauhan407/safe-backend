import { model, Schema } from "mongoose";
import { IAlert } from "../shared/interfaces/alert.interface";

const alertSchema = new Schema<IAlert>({
  role: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  constructionSiteId: { type: String, required:true},
  reportingFor: { type: String, required: true },
  emergencyType: { type: String, required: true },
  degreeOfEmergency: { type: Number, required: true},
  alertLocation: { type: Object, required: true },
  workersInjured: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  responseAction: { type: Object, default: null},
  followUpAction: { type: String },
  recipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  emergencyText: { type: String},
  resolved: { type: Boolean, required: true, default: false},
  assistance: { type: Boolean, required: true },
  smsSent: { type: Boolean, required: true, default: false},
  imageUrl: { type: String },
});

export default model<IAlert>("Alert", alertSchema);
