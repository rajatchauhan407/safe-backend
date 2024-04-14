import Express from "express";
import validateJWT from '../middlewares/validateJWT.js';
import geoLocationController from '../controllers/geoLocationController.js'

const router = Express.Router();
 
router.post("/checkin",validateJWT,geoLocationController.checkInUser)
router.post("/checkout",validateJWT,geoLocationController.checkOutUser)
router.get("/getsafezone",validateJWT,geoLocationController.getSafeZone)
router.get("/safezonecheck",validateJWT,geoLocationController.checkIfUserInSafeZone)
router.post("/workersdata",validateJWT,geoLocationController.getWorkersData)
router.post("/workerstatus",validateJWT,geoLocationController.checkedStatusOfWorker)
router.post("/safezoneworkersdata",validateJWT,geoLocationController.getSafeZoneWorkersData)
router.post("/createsafezoneworker",validateJWT,geoLocationController.createSafeZoneWorker)

export default router;
