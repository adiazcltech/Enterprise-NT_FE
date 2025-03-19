import { Router } from "express";
import { getResolution4505 } from "../controllers/contoller.resolution";
import validate from "../middleware/validate";
import { body } from "express-validator";

const router = Router();

router.patch('/resolution', [ validate([
    body('init').notEmpty(),
    body('end').notEmpty()
])] , getResolution4505);

export default router;