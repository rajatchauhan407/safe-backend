import Express from 'express';

const router = Express.Router();

import NotificationController from '../controllers/notification.controller.js';

router.post('/alert',NotificationController.createAlert);

router.get('/alert/:alertId',NotificationController.cancelAlert);

router.get('/alert',NotificationController.getAlert);

export default router;