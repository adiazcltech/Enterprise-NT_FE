import { Request, Response } from "express";

import getResolution from "../db/results";


export const getResolution4505 = async( req: Request, res: Response ) => {
    try {
    const body = req.body;
    console.log(`Inicia Consulta resolución desde: ${body.initDate} hasta: ${body.endDate} - Rango de ${body.init} a ${body.end}`);
    const resolution4505: any = await getResolution(body);
    res.json(resolution4505);
    }
    catch(err) {
        console.log(err);
        res.status(500).json("error");
    }
}