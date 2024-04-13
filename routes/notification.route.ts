import Express from 'express';
import validateJWT from '../shared/validations/validateJWT.js';
import NotificationController from '../controllers/notification.controller.js';

const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router
router.use(validateJWT);

router.post('/alert', NotificationController.createAlert);

router.get('/alert/:alertId', NotificationController.cancelAlert);

router.get('/alert', NotificationController.getAlert);

router.post('/alert-worker', NotificationController.alertWorker);

router.get('/alert-worker',NotificationController.getWorkerAlert);

router.post('/sosalert', NotificationController.createSOSAlert);

router.get('/sosinfo', NotificationController.getSOSAlertInfo);

router.post('/supervisor-alert', NotificationController.createAlertBySupervisor);

router.post('/resolver-sos');

export default router;