import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import CompanyController from '../controllers/company.controller.js';

const router = Express.Router();

router.post('/company', CompanyController.createCompany);
router.post('/site', CompanyController.createSite);
router.post('/emergency-contact', CompanyController.createEmergencyContact);
router.post('/emergency-situation', CompanyController.createEmergencySituation);
router.post('/sitename',validateJWT,CompanyController.getSiteName)
router.get('/sitelist',CompanyController.getSiteList)

export default router;