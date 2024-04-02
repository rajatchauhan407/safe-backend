import { Application } from "twilio/lib/twiml/VoiceResponse.js";
import AlertService from "../services/notifications/alert.js";
import { Request, Response, NextFunction } from "express";
import ApplicationError from "../errors/applicationError.js";
import uploadDataToS3 from "../utils/s3/uploadToS3.js";
import LoginService from "../services/auth/login.js";
import {Expo} from 'expo-server-sdk';

class NotificationController {

  // create an alert
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationService = req.app.get('notificationService');
      // console.log('body req',req);
      // console.log('body',req.body._parts[0]);

      
      const alertData = req.body;
      alertData.needAssistance = alertData.needAssistance === 'true' ? true : false;
      console.log('alertData:', alertData);
      if (req.body.photo) {
  
        const fileName = `${new Date().toISOString()}-alert-${req.body.constructionSiteId}`;
        const imageUrl = await uploadDataToS3(fileName, req.body.photo, 'jpeg');
        alertData.imageUrl = imageUrl;
      }
      
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

// create alert by supervisor`
async createAlertBySupervisor(req: Request, res: Response, next: NextFunction) {
  try {
    const notificationService = req.app.get('notificationService');
    console.log('body req',req);
    // console.log('body',req.body._parts[0]);
    
    const alertData = req.body;
    alertData.needAssistance = alertData.needAssistance === 'true' ? true : false;
    alertData.resolved = true;
    console.log('alertData:', alertData);
    if (req.body.photo) {

      const fileName = `${new Date().toISOString()}-alert-${req.body.constructionSiteId}`;
      const imageUrl = await uploadDataToS3(fileName, req.body.photo, 'jpeg');
      alertData.imageUrl = imageUrl;
    }
    
    const newAlert = await AlertService.getInstance().createAlert(alertData);
    
    // sending alert to the supervisor
    notificationService.alertSupervisor(newAlert);
    if (newAlert instanceof ApplicationError) {
      throw newAlert;
    }
    res.status(201).json(newAlert);
  } catch (error) {
    console.log(error)
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

  // get an alert
  public async getAlert(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.body);
      const constructionSiteId = req.query.constructionSiteId as string;
      // console.log('params', req.query);  
      // console.log('constructionSiteId:', req.body.constructionSiteId);
      const alert = await AlertService.getInstance().getAlert(constructionSiteId);
      if (alert instanceof ApplicationError) {
        throw alert;
      }
      res.status(200).json(alert);
      
    } catch (error) {
      next(error);
    }
  }

  public async getWorkerAlert(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.body);
      const constructionSiteId = req.query.constructionSiteId as string;
      // console.log('params', req.query);  
      // console.log('constructionSiteId:', req.body.constructionSiteId);
      const alert = await AlertService.getInstance().getWorkerAlert(constructionSiteId);
      if (alert instanceof ApplicationError) {
        throw alert;
      }
      res.status(200).json(alert);
      
    } catch (error) {
      next(error);
    }
  }


  public async alertWorker(req: Request, res: Response, next: NextFunction) {
    /** Initializing alert worker ****/
    
    try{
      const notificationService = req.app.get('notificationService');
      const alertData = req.body;
      console.log('alertData:',alertData);

      const alert = await AlertService.getInstance().getAlert(alertData.constructionSiteId);
      if(alert instanceof ApplicationError){
        throw alert;
      }
      if('_id' in alert ){
        const newAlert = AlertService.getInstance().updateAlertBySupervisor(alert._id, {
          supervisorId:alertData.supervisorId,
          actionType:alertData.action
        });
        if(newAlert instanceof ApplicationError){
          throw newAlert;
        }
        // sending alert to the worker
        await notificationService.alertWorker(newAlert);


        const pushTokenData = await LoginService.retrieveTokens(alertData.constructionSiteId);

        console.log('pushTokenData:',pushTokenData);
        
        if(pushTokenData instanceof ApplicationError){
          throw pushTokenData;
        }

        if(Array.isArray(pushTokenData)){
          for(const token of pushTokenData){
            await notificationService.sendPushNotification(token.token, newAlert);
          }
        }
        
        res.status(200).json({message:'Alert sent to the worker', updatedAlert:newAlert});

      }
    }catch(error){
      next(error);
    }
  }

  // create SOS
  async createSOSAlert(req: Request, res: Response, next: NextFunction) {
    try {      
      const data = req.body;  
      const notificationService = req.app.get('notificationService');   
      console.log('SOSAlertData:', data);      
      const newAlert = await AlertService.getInstance().createSOSAlert(data.location, data.siteId, data.workerId);
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

}


export default new NotificationController();