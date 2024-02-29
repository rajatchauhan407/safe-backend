import Alert from "../../models/alert.model.js";
import { IAlert } from "../../shared/interfaces/alert.interface";
class AlertService {
  private static instance: AlertService;
  private constructor() {}
  public static getInstance() {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }
  public async createAlert(
    options:IAlert
  ):Promise<IAlert> {
    try {
        const {
            role,
            userId,
            alertLocation,
            emergencySituationId,
            emergencyNotification,
            responseAction,
            followUpAction,
            recipients,
            emergencyText
        } = options;

        const timestamp = new Date();
        const alert = new Alert({
            role,
            userId,
            alertLocation,
            emergencySituationId,
            emergencyNotification,
            timestamp,
            responseAction,
            followUpAction,
            recipients,
            emergencyText
        });
      await alert.save();
      return alert;
    } catch (error) {
      throw error;
    }
  }
}

export default AlertService;
