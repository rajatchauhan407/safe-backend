import Express from "express";

const router = Express.Router();
import geoLocationController from '../controllers/geoLocationController.js'

router.post("/checkin",geoLocationController.checkInUser)
router.post("/checkout",geoLocationController.checkOutUser)
router.get("/getsafezone",geoLocationController.getSafeZone)
router.get("/safezonecheck",geoLocationController.checkIfUserInSafeZone)
router.post("/workersdata",geoLocationController.getWorkersData)
router.post("/workerstatus",geoLocationController.checkedStatusOfWorker)
router.post("/safezoneworkersdata",geoLocationController.getSafeZoneWorkersData)
router.post("/createsafezoneworker",geoLocationController.createSafeZoneWorker)

export default router;
