import { Request, Response } from "express";
import { deleteTemplate, getDataCube, getTemplate, insertTemplate } from "../db/statisticalcube";
import { validateToken } from "../tools/common";

export const execute = async (req: Request, res: Response) => {
    try {
    const body = req.body;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const validate = await validateToken(token.split(" ")[1]);
    if (!validate) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const dataCube: any = await getDataCube(body, validate);
    res.status(200).json(dataCube);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}

export const insert = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const resp: any = await insertTemplate(body);
        res.json(resp);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}

export const get = async (req: Request, res: Response) => {
    try {
        const resp: any = await getTemplate();
        res.json(resp);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}

export const deleteT = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resp: any = await deleteTemplate(+id);
        res.json(resp);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
}
