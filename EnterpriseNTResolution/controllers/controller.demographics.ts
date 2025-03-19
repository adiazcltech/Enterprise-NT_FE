import { Request, Response } from "express";
import { listDemographics, listDemographicsCube } from "../db/demographics";
import { ResponseHandler } from "../exceptions/ResponseUtils";

export const getByState = async( req: Request, res: Response ) => {
    try {
    const { state } = req.params;
    const demos: any = await listDemographics(+state);
    res.json(demos);
    }
    catch(err) {
        console.log(err);
        res.status(500).json("error");
    }
}

export const cube = async( req: Request, res: Response ) => {
    try {
    const demos: any = await listDemographicsCube();
    res.json(demos);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(ResponseHandler.sendErrorResponse("Error"));
    }
}