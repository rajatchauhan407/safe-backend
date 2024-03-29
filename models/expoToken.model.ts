import { Schema, model } from "mongoose";
import { IExpoToken } from "../shared/interfaces/expoToken.interface";

const expoTokenSchema = new Schema<IExpoToken>({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    platform: { type: String, required: true }
});

export default model<IExpoToken>("ExpoToken",expoTokenSchema);
