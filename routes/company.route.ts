import Express from 'express';

const router = Express.Router();

import CompanyController from '../controllers/company.controller.js';

router.get('/company', CompanyController.createCompany);

export default router;