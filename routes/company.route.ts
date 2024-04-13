import Express from 'express';
import validateJWT from '../shared/validations/validateJWT.js';
import CompanyController from '../controllers/company.controller.js';

const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router except /sitelist
router.use((req, res, next) => {
    if (req.path !== '/sitelist') {
        validateJWT(req, res, next);
    } else {
        next();
    }
});

router.post('/company', CompanyController.createCompany);
router.post('/site', CompanyController.createSite);
router.post('/emergency-contact', CompanyController.createEmergencyContact);
router.post('/emergency-situation', CompanyController.createEmergencySituation);
router.post('/sitename',CompanyController.getSiteName)
router.get('/sitelist',CompanyController.getSiteList)

export default router;