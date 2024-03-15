import { Schema, model } from "mongoose";
import { IAddress } from "../shared/interfaces/address.interface";
import SafeValidator from "../shared/validations/validator.js";

const addressSchema = new Schema<IAddress>({
  street: {
    type: String,
    validate: {
      validator: SafeValidator.validateAddress,
      message: (props) => `${props.value} is not a valid street!`,
    },
    required: [true, "Street is required !"],
  },
  city: {
    type: String,
    validate: {
      validator: SafeValidator.validateAddress,
      message: (props) => `${props.value} is not a valid street!`,
    },
    required: [true, "City is required !"],
  },
  state: {
    type: String,
    validate: {
      validator: SafeValidator.validateAddress,
      message: (props) => `${props.value} is not a valid street!`,
    },
    required: [true, "State is required !"],
  },
  zip: {
    type: String,
    validate: {
      validator: SafeValidator.validateAddress,
      message: (props) => `${props.value} is not a valid street!`,
    },
    required: [true, "Zip is required !"],
  },
});

export default model<IAddress>("Address", addressSchema);
