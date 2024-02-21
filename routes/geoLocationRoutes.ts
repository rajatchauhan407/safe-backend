import Express from "express";

const router = Express.Router();
import {checkInUser} from '../controllers/geoLocationController.js'

router.get("/checkInUser",checkInUser)

export default router;
