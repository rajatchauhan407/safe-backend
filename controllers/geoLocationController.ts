import { Request, Response, NextFunction } from "express";
import Express from "express";
const app = Express();
import GeoLocation from '../services/geo-location/geoLocation.js'; // Importing the GeoLocation class
const geo = new GeoLocation(); // Creating an instance of GeoLocation

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


