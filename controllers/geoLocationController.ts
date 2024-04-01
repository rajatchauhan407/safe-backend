import { Request, Response, NextFunction } from "express";
import Express from "express";
import GeoLocation from '../services/geo-location/geoLocation.js'; 
import { Server as SocketIOServer } from 'socket.io';
const app = Express();
const io = new SocketIOServer(); 
const geo = new GeoLocation(io); 

class GeoLocationController{
    
    async checkInUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.location);
            const result = await geo.checkInUser(data.location, data.siteId, data.workerId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }
    
    async checkOutUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.location);
            const result = await geo.checkOutUser(data.siteId, data.workerId);
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
            const result = await geo.createSafeZoneWorker(data.siteId, data.workerId);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

}

const geoLocationController = new GeoLocationController();
export default geoLocationController;




