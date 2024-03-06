import { model, Schema } from "mongoose";
import { IAlert } from "../shared/interfaces/alert.interface";

const alertSchema = new Schema<IAlert>({
  role: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  emergencyType: { type: String, required: true },
  degreeOfEmergency: { type: String, required: true},
  alertLocation: { type: Object, required: true },
  emergencySituationId: {
    type: Schema.Types.ObjectId,
    ref: "EmergencySituation",
    required: true,
  },
  emergencyNotification: { type: Boolean, required: true },
  timestamp: { type: Date, required: true },
  responseAction: { type: String },
  followUpAction: { type: String },
  recipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  emergencyText: { type: String, required: true },
  resolved: { type: Boolean, required: true, default: false},
  assistance: { type: Boolean, required: true },
  imageUrl: { type: String },
});

export default model<IAlert>("Alert", alertSchema);
