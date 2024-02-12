import { model, Schema } from "mongoose";
import { IAlert } from "../shared/interfaces/alert.interface";

const alertSchema = new Schema<IAlert>({
  role: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
});

export default model<IAlert>("Alert", alertSchema);
