import { Request, Response } from "express";
import { getStatistics } from "../db/statistics";
import { ResponseHandler } from "../exceptions/ResponseUtils";
import { getManagement } from "../db/resultschecking";

export const statisticsController = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body.canceledorders){
            const statics = await getStatistics(body);
            res.status(200).json(statics);
        }else{
            const staticsOrderCanceled = await getManagement(body);
            res.status(200).json(staticsOrderCanceled);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(ResponseHandler.sendErrorResponse('Error al obtener la gestión'));
    }
}