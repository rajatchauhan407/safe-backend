import { ICompany } from "../shared/interfaces/company.interface";

import { Schema, model } from "mongoose";
import SafeValidator from "../shared/validations/validator.js";
import Address from "./address.model.js";

const companySchema = new Schema<ICompany>({
  companyName: { type: String, 
                validate:{
                    validator: (companyName:string)=>SafeValidator.validateCompanyName(companyName,100),
                    message: props => `${props.value} is not a valid company name!`
                },
                required: [true,'Company Name is required !'] },
  phoneNumber: { type: String, 
                 validate:{
                    validator: SafeValidator.validatePhoneNumber,
                    message: props => `${props.value} is not a valid phone number!`
                    },    
                required: [true, 'Phone number is required !'] },
  email: { type: String,
            validate: {
                validator:SafeValidator.validateEmail,
                message: props => `${props.value} is not a valid email address!`
                },
          required: [true, 'Email is required !'] },
  address: { type: Address.schema, 
                required: [true, 'Address is required !'] },
});

export default model<ICompany>("Company", companySchema);