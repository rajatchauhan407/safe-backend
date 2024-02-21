import Express from "express";

const router = Express.Router();
import {
  test
} from "../controllers/geoLocationController";

router.get("/test",test);

export default router;
