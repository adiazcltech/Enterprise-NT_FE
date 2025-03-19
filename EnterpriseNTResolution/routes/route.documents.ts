import { Router } from "express";
import * as documents from "../controllers/controller.documents";

const router = Router();

router.post('/', documents.uploadFileContoller);//ruta para subir archivos
router.patch('/', documents.modifyFileContoller);//ruta para subir archivos
router.get('/order/:idorder', documents.getDocumentsByOrderContoller);
router.get('/order/:idorder/test/:testid', documents.getDocumentsByTestContoller )


export default router;