import {ICompany} from "../../shared/interfaces/company.interface";
import {IError} from "../../shared/interfaces/error.interface";
import Company from "../../models/company.model.js";
import ApplicationError from "../../errors/applicationError.js";

class CompanyService{
    constructor() {
    }

    public async registerCompany(userData:ICompany):Promise<{data:ICompany | null, error:IError|null}>{  
        // console.log(userData)
        const newCompany = new Company(userData);
        try {
            const savedCompany = await newCompany.save();
            return {data:savedCompany, error:null}
        } catch (err: any) {
            // console.log(err)
           return {
            data:null,
            error: new ApplicationError('Error saving company',500,'Error saving company',err)
           }
        }
        
    }
}

export default CompanyService;