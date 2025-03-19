import { Router } from "express";
import { getByState, cube } from "../controllers/controller.demographics";

const router = Router();

router.get('/state/:state', getByState);
router.get('/cube', cube);

export default router;