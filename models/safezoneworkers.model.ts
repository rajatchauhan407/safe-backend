import {model, Schema} from "mongoose";
import SafeValidator from "../shared/validations/validator.js";
import { ISafeZoneWorkers } from "../shared/interfaces/safezone.interface.js";

const safeZoneWorkersSchema = new Schema<ISafeZoneWorkers>({
    userType: {
        type: String,
        required: true,
        validate:{
            validator: (v:string)=>{return SafeValidator.validateUserType(v)},
            message: "User type must be either worker or supervisor"
        }
    },
    userId: {
        type: String,
        required: true,
    },
    constructionSiteId: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
});

export default model<ISafeZoneWorkers>("SafeZoneWorker", safeZoneWorkersSchema);