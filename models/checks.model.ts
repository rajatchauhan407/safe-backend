import {model, Schema} from "mongoose";
import SafeValidator from "../shared/validations/validator.js";
import { IChecking } from "../shared/interfaces/checks.interface";

const checksSchema = new Schema<IChecking>({
    userType: {
        type: String,
        required: true,
        validate:{
            validator: (v:string)=>{return SafeValidator.validateUserType(v)},
            message: "User type must be either worker or supervisor"
        }
    },
    checkType: {
        type: String,
        required: true
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

export default model<IChecking>("Checking", checksSchema);