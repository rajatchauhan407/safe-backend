import { Request, Response, NextFunction } from 'express';
import CompanyService from '../services/company/companyService.js';
class CompanyController{

    public async createCompany(req:Request, res:Response, next:NextFunction) {
        console.log('hello')
        try {
          const companyData = req.body;
          const newCompany = await new CompanyService().registerCompany(companyData);
          console.log(newCompany)
          if(newCompany.error){
            next(newCompany.error);
          }else{
            res.status(201).json(newCompany.data);
          }
        } catch (error) {
          next(error);
        }
      }

      public async createSite(req:Request, res:Response, next:NextFunction) {
        try {
          const siteData = req.body;
          const newSite = await new CompanyService().registerSite(siteData);
          console.log(newSite)
          if(newSite.error){
            next(newSite.error);
          }else{
            res.status(201).json(newSite.data);
          }
        } catch (error) {
          next(error);
        }
      }

      public async createEmergencyContact(req:Request, res:Response, next:NextFunction) {
        try {
          const emergencyContactData = req.body;
          const newContact = await new CompanyService().registerEmergencyContact(emergencyContactData);
          console.log(newContact)
          if(newContact.error){
            next(newContact.error);
          }else{
            res.status(201).json(newContact.data);
          }
        } catch (error) {
          next(error);
        }
      }
      public async createEmergencySituation(req:Request, res:Response, next:NextFunction) {
        try {
          const emergencySituation = req.body;
          const newEmergencySituation = await new CompanyService().registerEmergencySituation(emergencySituation);
          console.log(newEmergencySituation)
          if(newEmergencySituation.error){
            next(newEmergencySituation.error);
          }else{
            res.status(201).json(newEmergencySituation.data);
          }
        } catch (error) {
          next(error);
        }
      }
      public async getSiteName(req:Request, res:Response, next:NextFunction) {
        try {
          let data = req.body;
          const siteName = await new CompanyService().getSiteName(data.siteId);
          console.log(siteName)
          if(siteName.error){
            next(siteName.error);
          }else{
            res.status(201).json(siteName.data);
          }
        } catch (error) {
          next(error);
        }
      }
      public async getSiteList(req:Request, res:Response, next:NextFunction) {
        try {
          let data = req.body;
          const siteName = await new CompanyService().getSiteList();
          console.log(siteName)
          if(siteName.error){
            next(siteName.error);
          }else{
            res.status(201).json(siteName.data);
          }
        } catch (error) {
          next(error);
        }
      }
    }
export default new CompanyController();