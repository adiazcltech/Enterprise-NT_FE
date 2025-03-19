import { Router } from "express";
import { body } from 'express-validator';
import validate from "../middleware/validate";
import { execute, insert, get, deleteT } from "../controllers/contoller.statisticalcube";
const router = Router();

router.patch('/execute', [ validate([
    body('init').notEmpty(),
    body('end').notEmpty()
])] , execute);

router.post('/', [ validate([
    body('name').notEmpty(),
    body('init').notEmpty(),
    body('end').notEmpty()
])] , insert);

router.get('/', get);
router.delete('/:id', deleteT);

export default router;