import { StorageConstanst } from "../tools/constants";
import fs from 'fs';
import documentOrders from "../entities/docsdb/documents.orders";
import { db, dbDoc } from "../db/config/conection";
import { dbToFile } from "../tools/storagemanagment";
import ducumentResult from "../entities/docsdb/documents.result";
import moment from "moment";
import { ResponseHandler } from "../exceptions/ResponseUtils";



export const uploadFile = async (documentdetail: DocumentDetail) => {
    try {

        const { file, idOrder, fileType, extension, name, idTest, viewresul, iduser, replace } = documentdetail;



        const dir_upload = `${StorageConstanst.DIR_STORAGE_ORDERS}/${idOrder}/${idTest ? idTest : ''}`;
        // crear una carpeta con el id de la orden en el directoio StorageConstanst.DIR_STORAGE
        if (dir_upload && !fs.existsSync(dir_upload)) {
            //crear carpetas y subcarpetas la ultima carpeta se va llamar storage_NT ES DECIR CONCATENARSELO A UPLOAD_FOLDER
            fs.mkdirSync(dir_upload, { recursive: true });

        }

        // guardar el archivo en el sistema de archivos
        const path = `${dir_upload}/${name.replace(/ /g, "_")}`;
        // guardar el archivo en base64 en el sistema de archivos en un archivo normal
        fs.writeFile(path, file, 'base64', (err) => {
            if (err) {
                console.log(err);
                return ({ message: "Error saving file", status: 500 });
            }
        });
        if (replace) {
            await documentOrders.update(
                { doc01c7: path, doc01c3: moment().format('YYYY-MM-DDTHH:mm:ss') },
                { where: { lab22c1: idOrder, doc01c1: name } }
            );
        }
        if (idTest && idTest !== 0) {
            if (replace) {
                await documentOrders.update(
                    { doc01c7: path, doc01c3: moment().format('YYYY-MM-DDTHH:mm:ss') },
                    { where: { lab22c1: idOrder, doc01c1: name } }
                );
                return ({ message: "File update", status: 200 });
            }
            // guardar el archivo en la base de datos
            await ducumentResult.create({
                lab22c1: idOrder,
                lab39c1: idTest,
                doc02c1: name,
                doc02c3: moment().format('YYYY-MM-DDTHH:mm:ss'),
                doc02c4: fileType,
                doc02c5: extension,
                doc02c6: viewresul ? 1 : 0,
                lab04c1: iduser,
                doc02c7: path
            });

        }
        else {
            if (replace) {
                await documentOrders.update(
                    { doc01c7: path, doc01c3: moment().format('YYYY-MM-DDTHH:mm:ss') },
                    { where: { lab22c1: idOrder, doc01c1: name } }
                );
                return ({ message: "File update", status: 200 });
            }
            documentOrders.create({
                lab22c1: idOrder,
                doc01c1: name,
                doc01c3: moment().format('YYYY-MM-DDTHH:mm:ss'),
                doc01c4: fileType,
                doc01c5: extension,
                doc01c6: viewresul ? 1 : 0,
                lab04c1: iduser,
                doc01c7: path
            });
        }
        var query = '';

        let currentYear = new Date().getFullYear();



        const  start = idOrder.toString().slice(0, 4);

        //let start = vInitial.split('-');

        let lab57 = +start === currentYear ? "lab57" : "lab57_" + start;
        let lab22 = +start === currentYear ? "lab22" : "lab22_" + start;
        




        if (idTest && idTest !== 0) {
            // obtener resultado de la consulta
            let queryResults = `SELECT lab57c8 FROM ${lab57} WHERE lab22c1 = '${idOrder}' AND lab39c1 = '${idTest}' and lab57c8 not in (0,1)`;



            const results = await db.query(queryResults);

            if (results[0].length === 0) {
                // actualizar el estado de la orden
                let query = `UPDATE ${lab57} SET lab57c8 = 2 , lab57c1 = 'rOLqfTWe3rV+FL2SKm9EsbMVVqWZjnP5' 
            WHERE lab22c1 = '${idOrder}' and lab39c1 = '${idTest}'`;
                await db.query(query);
            }

            query = `UPDATE ${lab57} SET lab57c41 = lab57c41 + 1 WHERE lab22c1 = '${idOrder}' AND  lab39c1 = '${idTest}'`;
            await db.query(query);

        } else {
            query = `UPDATE ${lab22} SET lab22c12 = lab22c12  + 1 WHERE lab22c1 = '${idOrder}'`;
            await db.query(query);

        }
        console.log (query);


        return ({ message: "File uploaded", status: 200 });

    }
    catch (err) {
        console.log(err);
        return ({ message: "Error saving file", status: 500 });
    }
}

export const deleteFile = async (idOrder: string, name: string, idTest: string, iduser: number) => {
    try {
        if (idTest && idTest !== '0') {
            await ducumentResult.destroy({
                where: {
                    lab22c1: idOrder,
                    lab39c1: idTest,
                    doc02c1: name
                }
            });
        }
        else {
            await documentOrders.destroy({
                where: {
                    lab22c1: idOrder,
                    doc01c1: name
                }
            });

        }

        db.query(`INSERT INTO lab03 (lab22c1, lab03c1,lab03c2, lab03c3, lab03c4, lab04c1, lab03c5) 
        VALUES (${idOrder}, '${idTest || 0}','D', 'DO', '1', ${iduser}, '${moment().format('YYYY-MM-DDTHH:mm:ss')}')`);
        const path = `${StorageConstanst.DIR_STORAGE_ORDERS}/${idOrder}/${idTest ? idTest : ''}/${name.replace(/ /g, "_")}`;
        fs.unlinkSync(path);

        let currentYear = new Date().getFullYear();
        const  start = idOrder.toString().slice(0, 4);

        //let start = vInitial.split('-');

        let lab57 = +start === currentYear ? "lab57" : "lab57_" + start;
        let lab22 = +start === currentYear ? "lab22" : "lab22_" + start;
        let query = '';

        if (idTest && idTest !== '0' ) {
            // obtener resultado de la consulta
            let queryResults = `SELECT lab57c8 FROM ${lab57} WHERE lab22c1 = '${idOrder}' AND lab39c1 = '${idTest}' and lab57c8 = 2 AND lab57c1 = 'rOLqfTWe3rV+FL2SKm9EsbMVVqWZjnP5'`;

            const results = await db.query(queryResults);

            if (results[0].length > 0) {
                // actualizar el estado de la orden
                let query = `UPDATE ${lab57} SET lab57c8 = 0 , lab57c1 = NULL 
            WHERE lab22c1 = '${idOrder}' and lab39c1 = '${idTest}'`;
                await db.query(query);
            }

            query = `UPDATE ${lab57} SET lab57c41 = lab57c41 - 1 WHERE lab22c1 = '${idOrder}' AND  lab39c1 = '${idTest}'`;

        } else {
            query = `UPDATE ${lab22} SET lab22c12 = lab22c12  - 1 WHERE lab22c1 = '${idOrder}'`;
        }

        await db.query(query);

        
        return ({ responseJSON: ResponseHandler.sendResponse, status: 200 });
    }
    catch (err) {
        console.log(err);
        return ({ responseJSON: ResponseHandler.sendErrorResponse("error deleting file"), status: 500 });
    }
}

export const getFliesByOrder = async (idOrder: string) => {
    try {
        const files = await documentOrders.findAll({
            where: {
                lab22c1: idOrder,
            },
        });

        // Mapear los campos
        const mappedFiles = files.map((file: any) => {
            let fileData: any = {};

            // Leer el archivo como base64
            if (file.doc01c7 !== null) {
                fileData.file = fs.readFileSync(file.doc01c7, 'base64');
            } else {
                const ImaBytes: Buffer | null = file.doc01c2;
                if (ImaBytes) {
                    fileData.file = ImaBytes.toString('base64');
                    //CONSTRUIR RUTA DE ARCHIVO
                    let path = `${StorageConstanst.DIR_STORAGE_ORDERS}/${file.lab22c1}`;
                    // guardar el archivo en el sistema de archivos
                    dbToFile(fileData.file, path, file.doc01c1).then(async (res) => {
                        if (res) {
                            console.log('Archivo guardado correctamente');
                            await documentOrders.update(
                                { doc01c7: `${path}/${file.doc01c1.replace(/ /g, "_")}` },
                                { where: { lab22c1: file.lab22c1, doc01c1: file.doc01c1 } }
                            );
                            dbDoc.query(`UPDATE doc01 SET doc01c2 = NULL 
                                WHERE lab22c1 = ${file.lab22c1} AND doc01c1 = '${file.doc01c1}'`);
                        }
                    });
                } else {
                    fileData.file = null; // Manejo de caso en que no hay datos
                }

            }

            // Cambiar el nombre de las llaves
            fileData.idOrder = file.lab22c1;
            fileData.name = file.doc01c1;
            fileData.date = file.doc01c3;
            fileData.replace = false;
            fileData.delete = false;
            fileData.fileType = file.doc01c4;
            fileData.extension = file.doc01c5;
            fileData.viewresul = file.doc01c6 === 1 ? true : false;
            fileData.comment = null;

            return fileData; // Devolver el nuevo objeto mapeado
        });

        return mappedFiles; // Devolver la lista de archivos mapeados
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getFliesByTest = async (idTest: string, idOrder: string) => {
    try {
        const files = await ducumentResult.findAll({
            where: { lab39c1: idTest, lab22c1: idOrder }
        });

        // Mapear los campos

        const mappedFiles = files.map((file: any) => {
            let fileData: any = {};

            // Leer el archivo como base64
            if (file.doc02c7 !== null) {
                fileData.file = fs.readFileSync(file.doc02c7, 'base64');
            } else {
                const ImaBytes: Buffer | null = file.doc02c2;
                const pathdb = file.doc02c7;
                if (!pathdb && ImaBytes) {
                    fileData.file = ImaBytes.toString('base64');
                    //CONSTRUIR RUTA DE ARCHIVO
                    let path = `${StorageConstanst.DIR_STORAGE_ORDERS}/${file.lab22c1}/${file.lab39c1}`;
                    // guardar el archivo en el sistema de archivos
                    dbToFile(fileData.file, path, file.doc02c1).then(async (res) => {
                        if (res) {
                            console.log('Archivo guardado correctamente');
                            await ducumentResult.update(
                                { doc02c7: `${path}/${file.doc02c1.replace(/ /g, "_")}` },
                                { where: { lab22c1: file.lab22c1, lab39c1: file.lab39c1, doc02c1: file.doc02c1 } }
                            );
                            dbDoc.query(`UPDATE doc02 SET doc02c2 = NULL
                                WHERE lab22c1 = ${file.lab22c1} AND lab39c1 = ${file.lab39c1} AND doc02c1 = '${file.doc02c1}'`);
                        }
                    });
                } else {
                    fileData.file = null; // Manejo de caso en que no hay datos
                }

            }

            // Cambiar el nombre de las llaves
            fileData.idOrder = file.lab22c1;
            fileData.idTest = file.lab39c1;
            fileData.name = file.doc02c1;
            fileData.date = file.doc02c3;
            fileData.replace = false;
            fileData.delete = false;
            fileData.fileType = file.doc02c4;
            fileData.extension = file.doc02c5;
            fileData.viewresul = file.doc02c6 === 1 ? true : false;
            fileData.comment = null;

            return fileData; // Devolver el nuevo objeto mapeado
        });

        return mappedFiles; // Devolver la lista de archivos mapeados
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

