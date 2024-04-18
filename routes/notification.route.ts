import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import NotificationController from '../controllers/notification.controller.js';

const router = Express.Router();

router.post('/alert',validateJWT, NotificationController.createAlert);

router.get('/alert/:alertId',validateJWT, NotificationController.cancelAlert);

router.get('/alert', validateJWT,NotificationController.getAlert);

router.post('/alert-worker',validateJWT, NotificationController.alertWorker);

router.get('/alert-worker',validateJWT,NotificationController.getWorkerAlert);

router.post('/sosalert', validateJWT,NotificationController.createSOSAlert);

router.get('/sosinfo', validateJWT,NotificationController.getSOSAlertInfo);

router.post('/supervisor-alert', validateJWT,NotificationController.createAlertBySupervisor);

router.post('/resolver-sos');

export default router;