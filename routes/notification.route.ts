import Express from 'express';

const router = Express.Router();


import NotificationController from '../controllers/notification.controller.js';

router.post('/alert', NotificationController.createAlert);

router.get('/alert/:alertId', NotificationController.cancelAlert);

router.get('/alert', NotificationController.getAlert);

router.post('/alert-worker', NotificationController.alertWorker);

router.get('/alert-worker',NotificationController.getWorkerAlert);

router.post('/sosalert', NotificationController.createSOSAlert);

router.post('/supervisor-alert', NotificationController.createAlertBySupervisor);

router.post('/resolver-sos');

export default router;