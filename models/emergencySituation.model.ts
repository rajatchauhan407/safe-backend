import { model, Schema } from "mongoose";

import { IEmergencySituation } from "../shared/interfaces/emergencySituation.interface";

const emergencySituationSchema = new Schema<IEmergencySituation>({
    name: { type: String, required: true },
    severity: { type: String, required: true },
    firstAid: { type: String, required: true },
    whistles: { type: String, required: true },

});

export default model<IEmergencySituation>("EmergencySituation", emergencySituationSchema);