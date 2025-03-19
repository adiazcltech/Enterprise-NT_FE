import { db } from "../../config/conection";

export const insertAudit = async (body:AuditEmail) => {
    const [, resp] = await db.query("INSERT INTO lab166 (lab22c1, lab166c2, lab166c3, lab166c4, lab166c5, lab04c1, lab166c6, lab166c7) VALUES (:lab22c1, :lab166c2, :lab166c3, :lab166c4, :lab166c5, :lab04c1, :lab166c6, :lab166c7)", {
        replacements: { 
            lab22c1: body.order, 
            lab166c2: body.recipients, 
            lab166c3: body.body, 
            lab166c4: body.attachments, 
            lab166c5: body.subject, 
            lab04c1: body.user, 
            lab166c6: body.date,
            lab166c7: body.tests === undefined || body.tests === null ? null : body.tests
        }
    });
    return resp;
}