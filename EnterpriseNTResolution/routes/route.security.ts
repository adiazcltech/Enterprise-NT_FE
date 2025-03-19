import { Router } from "express";
import { validateTokenController } from "../controllers/controller.security";

const router = Router();

router.get('/validatetoken', validateTokenController);

export default router;
