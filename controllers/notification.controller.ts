import AlertService from "../services/notifications/alert.js";
import { Request, Response, NextFunction } from "express";
class NotificationController {
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const alertData = req.body;
      const newAlert = await AlertService.getInstance().createAlert(alertData);
      res.status(201).json(newAlert);
    } catch (error) {
      next(error);
    }
  }
}
export default new NotificationController();