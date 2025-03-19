import { Request, Response } from "express";
import { validateToken } from "../tools/common";
import { deleteFile, getFliesByOrder, getFliesByTest, uploadFile } from "../services/service.file";
import { ResponseHandler } from "../exceptions/ResponseUtils";

export const getDocumentsByOrderContoller = async (req: Request, res: Response) => {
    try {
        const { idorder } = req.params;
        console.log(idorder);
        const token = req.headers.authorization;
        // VALIDAR QUE EL USUARIO ESTE AUTENTICADO
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // VALIDAR QUE EL USUARIO TENGA PERMISOS PARA SUBIR ARCHIVOS
        const iduser = await validateToken(token.split(" ")[1]);
        if (iduser === 0) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const files =await getFliesByOrder(idorder);

        if (!files) {
            return res.status(404).json({ message: "No files found" });
        }

        return res.json(files);


    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}

export const getDocumentsByTestContoller = async (req: Request, res: Response) => {

    try {
        const { testid,idorder } = req.params;
        const token = req.headers.authorization;
        // VALIDAR QUE EL USUARIO ESTE AUTENTICADO
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // VALIDAR QUE EL USUARIO TENGA PERMISOS PARA SUBIR ARCHIVOS
        const iduser = await validateToken(token.split(" ")[1]);
        if (iduser === 0) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const files =await getFliesByTest(testid,idorder);

        if (!files) {
            return res.status(404).json({ message: "No files found" });
        }

        return res.json(files);

    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}
export const uploadFileContoller = async (req: Request, res: Response) => { 
    try {
        const {file, idOrder , fileType, extension ,name, idTest ,viewresul, replace} = req.body;
        const token = req.headers.authorization;
        // VALIDAR QUE EL USUARIO ESTE AUTENTICADO
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // VALIDAR QUE EL USUARIO TENGA PERMISOS PARA SUBIR ARCHIVOS
        const iduser = await validateToken(token.split(" ")[1]);
        if (iduser === 0) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!file || !idOrder || !fileType || !extension || !name) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // COMPROBAR QUE FILETYPE SEA  IMAGEN O PDF
        if ((fileType !== "image/jpeg" && fileType !== "document/pdf") && (extension !== "jpg" && extension !== "png" && extension !== "pdf" && extension !== "jpeg")) {
            return res.status(400).json({ message: "Invalid file type" });
        }
        const response =await  uploadFile ({file, idOrder, fileType, extension, name, idTest, viewresul, iduser,replace});
        return res.status(response.status).json({ message: response.message });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error saving file" });
    }
}

export const modifyFileContoller = async (req: Request, res: Response) => {
    try {
    const {file, idOrder , fileType, extension ,name, idTest ,viewresul ,hidden} = req.body;
    const token = req.headers.authorization;
    // VALIDAR QUE EL USUARIO ESTE AUTENTICADO
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // VALIDAR QUE EL USUARIO TENGA PERMISOS PARA SUBIR ARCHIVOS
    const iduser = await validateToken(token.split(" ")[1]);
    if (iduser === 0) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!file || !idOrder || !fileType || !extension || !name) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // COMPROBAR QUE FILETYPE SEA  IMAGEN O PDF
    if ((fileType !== "image/jpeg" && fileType !== "document/pdf") && (extension !== "jpg" && extension !== "png" && extension !== "pdf" && extension !== "jpeg")) {
        return res.status(400).json({ message: "Invalid file type" });
    }
    if (hidden){
    const operation = await deleteFile( idOrder,  name, idTest, iduser);
    return res.status(operation.status).json(operation.responseJSON );
    }
}
    catch (err) {
        console.log(err);
       
        res.status(500).json(ResponseHandler.sendErrorResponse("Error process file"));
    }
}
