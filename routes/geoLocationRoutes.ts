import Express from "express";

const router = Express.Router();
import {checkInUser,checkOutUser} from '../controllers/geoLocationController.js'

router.get("/checkInUser",checkInUser)
router.get("/checkOutUser",checkOutUser)

export default router;
