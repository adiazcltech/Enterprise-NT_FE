import { Request, Response } from "express";
import { validateToken } from "../tools/common";

export const validateTokenController = async (req :Request , res : Response) => {
 
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const validate = await validateToken(token.split(" ")[1]);
    if (validate === 0) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "Authorized" });
}

