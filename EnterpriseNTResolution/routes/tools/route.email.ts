import { Router } from "express";
import { body } from 'express-validator';
import validate from "../../middleware/validate";
import { send } from "../../controllers/controller.email";
const router = Router();

router.post('/', [ validate([
    body('recipients').notEmpty(),
    body('subject').notEmpty(),
    body('body').notEmpty(),
    body('order').notEmpty(),
    body('user').notEmpty(),
])] , send);

export default router;