import Express from "express";
import validateJWT from '../shared/validations/validateJWT.js';
import geoLocationController from '../controllers/geoLocationController.js'

const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router
router.use(validateJWT);

router.post("/checkin",geoLocationController.checkInUser)
router.post("/checkout",geoLocationController.checkOutUser)
router.get("/getsafezone",geoLocationController.getSafeZone)
router.get("/safezonecheck",geoLocationController.checkIfUserInSafeZone)
router.post("/workersdata",geoLocationController.getWorkersData)
router.post("/workerstatus",geoLocationController.checkedStatusOfWorker)
router.post("/safezoneworkersdata",geoLocationController.getSafeZoneWorkersData)
router.post("/createsafezoneworker",geoLocationController.createSafeZoneWorker)

export default router;
