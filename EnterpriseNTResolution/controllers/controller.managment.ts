import { Request, Response } from "express";
import { getManagement } from "../db/resultschecking";
import moment from "moment";

export const managementController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const management = await getManagement(body);
        //console.log("managm",management);
        if (Array.isArray(management) && management.length > 0) {
            return res.status(200).json(management);
        }
        return res.status(204).json({ message: 'No se encontraron resultados' });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error al obtener la gestión' });
    }
}

export const managementPanicController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const management = await getManagement(body);

        if (Array.isArray(management) && management.length > 0) {
            const transformedData = management.flatMap(item => {
                // Validar si `item` tiene el tipo correcto
                if (typeof item === "object" && item !== null && "tests" in item) {
                    const typedItem = item as ManagementItem; // Asegura que `item` es del tipo esperado
                   
                    return typedItem.tests.flatMap((test) => { 
                        // Utilizamos flatMap para agregar los resultados directamente al array principal
                        const baseData = {
                            order: typedItem.orderNumber,
                            patientId: typedItem.patient?.patientId || null,
                            name1: typedItem.patient?.name1?.trim() || null,
                            name2: typedItem.patient?.name2?.trim() || null,
                            lastName: typedItem.patient?.lastName?.trim() || null,
                            surName: typedItem.patient?.surName?.trim() || null,
                            testId: test.id,
                            testCode: test.code,
                            testName: test.name,
                            date: test.result?.dateResult
                                ? moment(test.result.dateResult).format("YYYY/MM/DD")
                                : null,
                           
                            userId: test.result?.userRes?.id || null,
                            username: typedItem.userValidation || null
                        };

                        if (Array.isArray(test.interviews)) {
                            return test.interviews.map(interview => ({
                                ...baseData, // Agregamos los datos básicos comunes
                              
                                questionId: interview.questionId || null,
                                question: interview.question || null,
                                answerId: interview.answerId || 0,
                                answerClose: interview.answerClose || null,
                                answer: interview.answer || null,
                                delta: interview.delta || null,
                                panic: interview.panic || null,
                               
                                 critic: interview.critic || null
                            }));
                        } else {
                            return { ...baseData, questionId: null, question: null, answerId: 0, answerClose: null,
                                 answer: null ,delta:null ,panic:null , critic:null};
                        }
                    });
                }
                return []; // Retorna vacío si el tipo no coincide
            });

            return res.status(200).json(transformedData);
        }
        return res.status(204).json({ message: 'No se encontraron resultados' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error al obtener la gestión' });
    }
};
