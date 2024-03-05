import Express from "express";

const router = Express.Router();
import geoLocationController from '../controllers/geoLocationController.js'

router.post("/checkin",geoLocationController.checkInUser)
router.get("/checkout",geoLocationController.checkOutUser)
router.get("/getsafezone",geoLocationController.getSafeZone)
router.get("/safezonecheck",geoLocationController.checkIfUserInSafeZone)

export default router;
