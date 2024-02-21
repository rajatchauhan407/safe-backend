import { Request, Response, NextFunction } from "express";
import Express from "express";
const app = Express();

import GeoLocation from '../services/geo-location/geoLocation'; // Importing the GeoLocation class

export async function test(req: Request, res: Response, next: NextFunction) {
    let data = req.body;
    const geo = new GeoLocation(); // Creating an instance of GeoLocation

    try {
        await geo.test("Hello from main.ts");
        res.status(200).send("Test successful"); // Sending a success response to the client
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error"); // Sending an error response to the client
    }
}
