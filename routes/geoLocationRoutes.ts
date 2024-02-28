import Express from "express";

const router = Express.Router();
import geoLocationController from '../controllers/geoLocationController.js'

router.get("/checkin",geoLocationController.checkInUser)
router.get("/checkout",geoLocationController.checkOutUser)
router.get("/getsafezone",geoLocationController.getSafeZone)

export default router;
