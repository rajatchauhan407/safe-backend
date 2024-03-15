import {model, Schema} from "mongoose";

import { IEmergencyContact } from "../shared/interfaces/emergencyContact.interface";

const emergencyContactSchema = new Schema<IEmergencyContact>({
    name: {type: String, required: true},
    phoneNumber: {type: String, required: true},
});


export default model<IEmergencyContact>("EmergencyContact", emergencyContactSchema);