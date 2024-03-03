import Alert from "../../models/alert.model.js";
import { IAlert } from "../../shared/interfaces/alert.interface";
import NotificationService from "./notifications.js";
import ApplicationError from "../../errors/applicationError.js";
import { IError } from "../../shared/interfaces/error.interface.js";
class AlertService extends NotificationService{
  private static instance: AlertService;
  private constructor() {
    super();
  }
  public static getInstance() {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }
// create an alert
  public async createAlert(
    options:IAlert
  ):Promise<IAlert | IError> {
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
            emergencyText,
            resolved = false
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
            emergencyText,
            resolved
        });
      await alert.save();
      return alert;
    } catch (err: unknown) {
      if (err instanceof ApplicationError) {
        return err
      }
      return new ApplicationError('Cannot create alert', 500, 'Can not create Alert',err);
    }
  }

  // cancel an alert
  public async cancelAlert(alertId:string):Promise<IAlert | IError | null> {
    try {
      const alert = await Alert.findByIdAndUpdate(alertId,{resolved:true},{new:true});
      if(alert?.resolved){
        throw new ApplicationError("Alert already cancelled",404,"Alert already cancelled",null);
      }
      if (!alert) {
        throw new ApplicationError("Alert not found", 404, "Alert not found",null);
      }
      return alert;
    } catch (error:unknown) {
      if (error instanceof ApplicationError) {
        return error;
      }
      return new ApplicationError('Cannot Cancel Alert', 400, 'Cannot cancel Alert',error);
    }
  }
}

export default AlertService;
