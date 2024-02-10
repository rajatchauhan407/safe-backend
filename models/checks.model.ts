import {model, Schema} from "mongoose";

import { IChecking } from "../shared/interfaces/checks.interface";

const checksSchema = new Schema<IChecking>({
    userType: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    constructionSiteId: {
        type: String,
        required: true,
    },
    timeStamps: {
        type: Date,
        required: true,
    },
});

export default model<IChecking>("Checking", checksSchema);