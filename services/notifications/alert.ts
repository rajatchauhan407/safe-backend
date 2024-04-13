import Alert from "../../models/alert.model.js";
import SOSAlert from "../../models/sosalert.model.js"
import User from "../../models/user.model.js"
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

         // Clear the SOSAlert collection
        await SOSAlert.deleteMany({});
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

    // get SOS alert data
    public async getSOSAlertInfo(): Promise<string[] | IError> {
      try {
        let sosAlertData: string[] = [];
        const sosAlert = await SOSAlert.findOne();
     
    if (sosAlert) {

      if (!sosAlert) {
        return new ApplicationError(
          "SOS Alert not found",
          404,
          "SOS Alert not found in the database",
          "SOS Alert not found in the database"
        );
      }
     
    const locationString = JSON.stringify(sosAlert.alertLocation);

    // Parse the string to extract latitude and longitude
    const match = locationString.match(/"latitude":\s*"(.*?)",.*"longitude":\s*"(.*?)"/);

    if (!match || match.length < 3) {
      return new ApplicationError(
        "Invalid location data",
        400,
        "Latitude or longitude not found in the location data",
        "Latitude or longitude not found in the location data"
      );
    }

    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
  

      const user = await User.findOne({ _id: sosAlert.userId });

      if (!user) {
        return new ApplicationError(
          "User not found",
          404,
          "User not found in the database",
          "User not found in the database"
        );
      }

      sosAlertData = [
        `Name: ${user.firstName} ${user.lastName}`,
        `Role: ${user.jobPosition}`,
        `SiteID: ${sosAlert.constructionSiteId}`,
        `latitude: ${latitude}`,
        `longitude: ${longitude}`,
        `Timestamp: ${sosAlert.timestamp}`
      ];
    }
    return sosAlertData;
  } catch (err: unknown) {
    if (err instanceof ApplicationError) {
      return err;
    }
    return new ApplicationError(
      "Cannot get SOS Alert data",
      500,
      "Can not get SOS Alert data",
      err
    );
  }
}
  
}

export default AlertService;
