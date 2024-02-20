import Express from "express";
const app = Express();

import GeoLocation from '../services/geo-location/geoLocation'; // Importing the GeoLocation class

export async function test(req, res, next) {
    let data = req.body;
    const geo = new GeoLocation(); // Creating an instance of GeoLocation

    try {
        await geo.test("Hello from main.ts"); // Calling the test method with a sample string
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
