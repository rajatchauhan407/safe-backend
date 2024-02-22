import { Request, Response, NextFunction } from "express";
import Express from "express";
const app = Express();
import GeoLocation from '../services/geo-location/geoLocation.js'; 
const geo = new GeoLocation(); 

export async function checkInUser(req: Request, res: Response, next: NextFunction) {
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

export async function checkOutUser(req: Request, res: Response, next: NextFunction) {
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


