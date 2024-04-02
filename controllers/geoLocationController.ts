import { Request, Response, NextFunction } from "express";
import Express from "express";
import GeoLocation from '../services/geo-location/geoLocation.js'; 

const app = Express();
const geo = new GeoLocation(); 

class GeoLocationController{
    
    async checkInUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            const notificationService = req.app.get('notificationService');
            console.log(data.location);
            const result = await geo.checkInUser(data.location, data.siteId, data.workerId);
            notificationService.workerStatusAlert();
            res.json(result);
        } catch (error) {
            next(error)
        }
    }
    
    async checkOutUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            const notificationService = req.app.get('notificationService');
            console.log(data.location);
            const result = await geo.checkOutUser(data.siteId, data.workerId);
            notificationService.workerStatusAlert();
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async getSafeZone(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.siteId)
            const result = await geo.getSafeZoneOfConstructionSite(data.siteId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async checkIfUserInSafeZone(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.siteId)
            const result = await geo.checkIfUserInSafeZone(data.location, data.siteId, data.workerId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async getWorkersData(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.siteId)
            const result = await geo.getWorkersData(data.siteId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async checkedStatusOfWorker(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.workerId);
            const result = await geo.getCheckedStatus(data.workerId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async getSafeZoneWorkersData(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.siteId)
            const result = await geo.getWorkersinSafeZoneData(data.siteId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }
    async createSafeZoneWorker(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            const notificationService = req.app.get('notificationService');
            const result = await geo.createSafeZoneWorker(data.siteId, data.workerId);
            notificationService.safeZoneWorkerStatusAlert();
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

}

const geoLocationController = new GeoLocationController();
export default geoLocationController;




