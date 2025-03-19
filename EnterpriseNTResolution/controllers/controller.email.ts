import { ResponseHandler } from "../exceptions/ResponseUtils";
import { sendEmail } from "../models/email";
import { Request, Response } from 'express';

export const send = async (req: Request<{}, {}, Email>, res: Response) => {
    try {
        let body: Email = req.body;

        
        // comprobar si los destinatarios son validos
        const regularEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const recipients: string[] = [];
        body.recipients.forEach((value: string) => {
            if (value !== '' && regularEmail.test(value)) {
                recipients.push(value.replace(/\s/g, '').replace(/\[|\]/g, ''));
            }
        });
        if (recipients.length === 0) {
            return res.status(400).json(ResponseHandler.sendErrorResponse('Destinatarios no válidos'));
        }
        body.recipients = recipients;
        
        const resp: any = await sendEmail(body);
        if (resp) {
            res.status(200).json({ ok: true, message: 'Email enviado correctamente' });
        }
        else {
            res.status(400).json({ ok: false, message: 'Error al enviar el email' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(ResponseHandler.sendErrorResponse('Error al enviar el email'));
    }
}