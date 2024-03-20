import {ICompany} from "../../shared/interfaces/company.interface";
import {IError} from "../../shared/interfaces/error.interface";
import Company from "../../models/company.model.js";
import ApplicationError from "../../errors/applicationError.js";
import ConstructionSite from "../../models/constructionSite.model.js";
import { IConstructionSite } from "../../shared/interfaces/constructionSite.interface";
import EmergencyContact from "../../models/emergencyContact.model.js";
import { IEmergencyContact } from "../../shared/interfaces/emergencyContact.interface";
import { IEmergencySituation } from "../../shared/interfaces/emergencySituation.interface";
import EmergencySituation from "../../models/emergencySituation.model.js";
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
            error: new ApplicationError('Error saving company',400,'Error saving company',err)
           }
        }
        
    }

    public async registerSite(siteData:IConstructionSite):Promise<{data:IConstructionSite | null, error:IError|null}>{  
        // console.log(userData)
        const newSite = new ConstructionSite(siteData);
        try {
            const savedSite = await newSite.save();
            return {data:savedSite, error:null}
        } catch (err: any) {
            // console.log(err)
           return {
            data:null,
            error: new ApplicationError('Error Saving Construction Site',400,'Error Saving Construction Site',err)
           }
        }
    }

    public async registerEmergencyContact(emergencyContactData:IEmergencyContact):Promise<{data:IEmergencyContact | null, error:IError|null}>{  
        // console.log(userData)
        const newSite = new EmergencyContact(emergencyContactData);
        try {
            const savedContact = await newSite.save();
            return {data:savedContact, error:null}
        } catch (err: any) {
            // console.log(err)
           return {
            data:null,
            error: new ApplicationError('Error Saving Emergency Contact',400,'Error Saving Emergency Contact',err)
           }
        }
    }
    public async registerEmergencySituation(emergencySituation:IEmergencySituation):Promise<{data:IEmergencySituation | null, error:IError|null}>{
            const newEmergencySituation = new EmergencySituation(emergencySituation);
            try {
                const savedEmergencySituation = await newEmergencySituation.save();
                return {data:savedEmergencySituation, error:null}
            } catch (err: any) {
                // console.log(err)
                return { 
                        data:null,
                        error:new ApplicationError('Error Saving Emergency Situation',400,'Error Saving Emergency Situation',err)
                        }
    }
}

 //Get Site Name 
 async getSiteName(siteId: string): Promise<{ data: String | null, error: IError | null }> {
    try {
      const site = await ConstructionSite.findOne({ _id: siteId}).lean().exec();
  
      if (!site) {
        return { data: null, error: new ApplicationError('Construction Site unavailable', 400, 'Construction Site unavailable', 'Construction Site unavailable') };
      }  
      let siteName =`${site.address.street}, ${site.address.city}`     
      return { data: siteName as String, error: null };
    } catch (error) {
      return { data: null, error: new ApplicationError('Something went wrong', 400, 'Something went wrong', error) };
    }
  }
}

export default CompanyService;