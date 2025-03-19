import { Router } from "express";
import { managementController, managementPanicController } from "../controllers/controller.managment";

const router = Router();

router.patch('/management', managementController);

router.patch('/management/panic', managementPanicController);

export default router;