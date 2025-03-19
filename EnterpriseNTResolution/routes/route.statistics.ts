import { Router } from "express";
import validate from "../middleware/validate";
import { body } from 'express-validator';
//import { getStatistics } from "../db/statistics";
import { statisticsController } from "../controllers/controller.statistics";

const router = Router();

router.patch('/general', [ validate([
    body('init').notEmpty(),
    body('end').notEmpty()
])] , statisticsController);

export default router;