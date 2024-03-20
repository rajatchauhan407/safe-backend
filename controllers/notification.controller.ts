import { Application } from "twilio/lib/twiml/VoiceResponse.js";
import AlertService from "../services/notifications/alert.js";
import { Request, Response, NextFunction } from "express";
import ApplicationError from "../errors/applicationError.js";

class NotificationController {

  // create an alert
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationService = req.app.get('notificationService');
      const alertData = req.body;
      console.log('alertData:', alertData);

      
      const newAlert = await AlertService.getInstance().createAlert(alertData);
      // sending alert to the supervisor
      notificationService.alertSupervisor(newAlert);
      if (newAlert instanceof ApplicationError) {
        throw newAlert;
      }
      res.status(201).json(newAlert);
    } catch (error) {
      next(error);
    }
  }

// cancel an alert
  public async cancelAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const alertId = req.params.alertId;
      console.log('alertId:', alertId);
      const alert = await AlertService.getInstance().cancelAlert(alertId);
      if (alert instanceof ApplicationError) {
        throw alert;
      }
      res.status(200).json({
        message: 'Alert cancelled successfully',
        alert,
      });
    } catch (error) {
      next(error);
    }
  }
}


export default new NotificationController();