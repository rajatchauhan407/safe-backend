import Express from 'express';

const router = Express.Router();

import CompanyController from '../controllers/company.controller.js';

router.post('/company', CompanyController.createCompany);
router.post('/site', CompanyController.createSite);
router.post('/emergency-contact', CompanyController.createEmergencyContact);
router.post('/emergency-situation', CompanyController.createEmergencySituation);
router.post('/sitename',CompanyController.getSiteName)
router.get('/sitelist',CompanyController.getSiteList)

export default router;