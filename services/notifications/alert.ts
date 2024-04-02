import Alert from "../../models/alert.model.js";
import SOSAlert from "../../models/sosalert.model.js"
import { IAlert } from "../../shared/interfaces/alert.interface";
import NotificationService from "./notifications.js";
import ApplicationError from "../../errors/applicationError.js";
import { IError } from "../../shared/interfaces/error.interface.js";
import { IAction } from "../../shared/interfaces/action.interface.js";
import {ISOSAlert} from "../../shared/interfaces/sosalert.interface"
class AlertService {
  private static instance: AlertService;
  // private constructor() {
  //   super();
  // }
  public static getInstance() {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }
  // create an alert
  public async createAlert(options: IAlert): Promise<IAlert | IError> {
    try {
      const timestamp = new Date();
      const alert = new Alert({ ...options, timestamp });
      await alert.save();
      return alert;
    } catch (err: unknown) {
      if (err instanceof ApplicationError) {
        return err;
      }
      return new ApplicationError(
        "Cannot create alert",
        500,
        "Can not create Alert",
        err
      );
    }
  }
// create alert by supervisor
public async createAlertBySupervisor(
 options: IAlert
): Promise<IAlert | IError> {
  try {
    const timestamp = new Date();
    const alert = new Alert({...options, timestamp });
    await alert.save();
    return alert;
  } catch (err: unknown) {
    if (err instanceof ApplicationError) {
      return err;
    }
    return new ApplicationError(
      "Cannot create alert",
      500,
      "Can not create Alert",
      err
    );
  }
}
  // cancel an alert
  public async cancelAlert(alertId: string): Promise<IAlert | IError | null> {
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        { resolved: true },
        { new: true }
      );
      if (alert?.resolved) {
        throw new ApplicationError(
          "Alert already cancelled",
          404,
          "Alert already cancelled",
          null
        );
      }
      if (!alert) {
        throw new ApplicationError(
          "Alert not found",
          404,
          "Alert not found",
          null
        );
      }
      return alert;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error;
      }
      return new ApplicationError(
        "Cannot Cancel Alert",
        400,
        "Cannot cancel Alert",
        error
      );
    }
  }

  public async getAlert(constructionSiteId: string): Promise<IAlert | IError> {
    try {
      const alert = await Alert.find({ constructionSiteId, resolved: false })
        .sort({ timestamp: -1 })
        .limit(1);
      console.log(alert[0]);
      return alert[0];
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error;
      }
      return new ApplicationError(
        "Cannot get alerts",
        400,
        "Cannot get alerts",
        error
      );
    }
  }

  public async getWorkerAlert(constructionSiteId: string): Promise<IAlert | IError> {
    try {
      const alert = await Alert.find({ constructionSiteId, resolved: true })
        .sort({ timestamp: -1 })
        .limit(1);
      console.log(alert[0]);
      return alert[0];
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error;
      }
      return new ApplicationError(
        "Cannot get alerts",
        400,
        "Cannot get alerts",
        error
      );
    }
  }

  public async updateAlertBySupervisor(
    alertId: string,
    responseAction: IAction
  ): Promise<IAlert | IError> {
    console.log(responseAction)
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {
          responseAction: {
            supervisorId: responseAction.supervisorId,
            actionType: responseAction.actionType,
          },
          resolved: true,
        },
        { new: true }
      );
      if (!alert) {
        throw new ApplicationError(
          "Alert not found",
          404,
          "Alert not found",
          null
        );
      }
      console.log(alert)
      return alert;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error;
      }
      return new ApplicationError(
        "Cannot alert workers",
        400,
        "Cannot alert workers",
        error
      );
    }
  }

    // create SOS alert
    public async createSOSAlert(userLocation: { latitude: number, longitude: number}, siteId: string, workerId: string): Promise<ISOSAlert | IError> {
      try {
        const timestamp = new Date();
        //const sosAlert = new SOSAlert({ options, timestamp });
        const sosAlert = new SOSAlert({

          role: "worker",
          userId: workerId,
          constructionSiteId: siteId,
          alertLocation: userLocation,
          timestamp: new Date()
        });
        await sosAlert.save();
        return sosAlert;
      } catch (err: unknown) {
        if (err instanceof ApplicationError) {
          return err;
        }
        return new ApplicationError(
          "Cannot create SOS Alert",
          500,
          "Can not create SOS Alert",
          err
        );
      }
    }

  
}

export default AlertService;
