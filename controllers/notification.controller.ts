import { Application } from "twilio/lib/twiml/VoiceResponse.js";
import AlertService from "../services/notifications/alert.js";
import { Request, Response, NextFunction } from "express";
import ApplicationError from "../errors/applicationError.js";
class NotificationController {

  // create an alert
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const alertData = req.body;
      const newAlert = await AlertService.getInstance().createAlert(alertData);
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
        return res.status(404).json(alert);
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