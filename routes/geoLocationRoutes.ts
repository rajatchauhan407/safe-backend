import Express from "express";

const router = Express.Router();
import geoLocationController from '../controllers/geoLocationController.js'

router.get("/checkInUser",geoLocationController.checkInUser)
router.get("/checkOutUser",geoLocationController.checkOutUser)

export default router;
