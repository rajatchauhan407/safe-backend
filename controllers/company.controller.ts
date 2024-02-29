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
    }
export default new CompanyController();