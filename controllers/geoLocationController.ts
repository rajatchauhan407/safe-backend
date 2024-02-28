import { Request, Response, NextFunction } from "express";
import Express from "express";
import GeoLocation from '../services/geo-location/geoLocation.js'; 
const app = Express();
const geo = new GeoLocation(); 

class GeoLocationController{
    
    async checkInUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.location);
            const result = await geo.checkInUser(data.location, data.siteId, data.workerId);
            res.json(result);
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ error: error });
        }
    }
    
    async checkOutUser(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.location);
            const result = await geo.checkOutUser(data.location, data.siteId, data.workerId);
            res.json(result);
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ error: error });
        }
    }

    async getSafeZone(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        try {
            console.log(data.siteId)
            const result = await geo.getSafeZoneOfConstructionSite(data.siteId);
            res.json(result);
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ error: error });
        }
    }

}

const geoLocationController = new GeoLocationController();
export default geoLocationController;




